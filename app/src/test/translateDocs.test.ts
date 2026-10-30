import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  actionFor,
  applyProseTranslations,
  chunkBody,
  compareBlocks,
  deslugifyTitle,
  fenceInfoString,
  isProseBlock,
  parseProseBlockResponse,
  proseBlockCandidates,
  proseBlockPrompt,
  protectCode,
  protectInlineCode,
  readManifest,
  redactSecret,
  restoreCode,
  sanitizeBody,
  sourceHash,
  splitFencedBlock,
  splitFrontmatter,
  validate,
  validateProseBlock,
} from '../../scripts/translate-docs.mjs';

const docWithFences = [
  '---',
  'title: Router Setup',
  '---',
  '',
  'Intro with [a link](guides/foo.md) and inline `code`.',
  '',
  '```bash',
  'apt install foo # $pecial <chars>',
  '```',
  '',
  'Between fences.',
  '',
  '~~~python',
  'x = 1',
  '~~~',
  '',
  '## Hardware',
  '',
  '| Model | RAM |',
  '| ----- | --- |',
  '| NUC | 8GB |',
  '',
  'End.',
].join('\n');

describe('sourceHash', () => {
  it('is stable and 16 hex chars', () => {
    const first = sourceHash('same content');
    expect(first).toBe(sourceHash('same content'));
    expect(first).toMatch(/^[0-9a-f]{16}$/);
  });

  it('changes when the content changes', () => {
    expect(sourceHash('a')).not.toBe(sourceHash('b'));
  });
});

describe('splitFrontmatter', () => {
  it('extracts title and body', () => {
    const { title, body } = splitFrontmatter(docWithFences);
    expect(title).toBe('Router Setup');
    expect(body.startsWith('\nIntro with')).toBe(true);
    expect(body).not.toContain('title:');
  });

  it('strips surrounding quotes from the title', () => {
    const { title } = splitFrontmatter('---\ntitle: "Quoted: Title"\n---\n\nBody');
    expect(title).toBe('Quoted: Title');
  });

  it('returns the whole content when there is no frontmatter', () => {
    const { frontmatter, title, body } = splitFrontmatter('# Just a heading\n');
    expect(frontmatter).toBeNull();
    expect(title).toBe('');
    expect(body).toBe('# Just a heading\n');
  });
});

describe('deslugifyTitle', () => {
  it('matches the app-side deslugify rules', () => {
    expect(deslugifyTitle('guides/mesh-network-basics')).toBe('Mesh Network Basics');
    expect(deslugifyTitle('software/yunohost/README')).toBe('Overview');
    expect(deslugifyTitle('about')).toBe('About');
  });
});

describe('protectCode / restoreCode', () => {
  it('replaces each fenced block with a marker on its own line', () => {
    const { text, blocks } = protectCode(docWithFences);
    expect(text).not.toContain('```');
    expect(text).not.toContain('~~~');
    expect(text).toContain('@@CODE_0@@');
    expect(text).toContain('@@CODE_1@@');
    expect(blocks).toEqual(['```bash\napt install foo # $pecial <chars>\n```', '~~~python\nx = 1\n~~~']);
  });

  it('keeps inline code untouched', () => {
    const { text } = protectCode('Use `inline` code.');
    expect(text).toBe('Use `inline` code.');
  });

  it('protects fences indented inside list items', () => {
    const text = ['1. Flash the router:', '', '    ```bash', '    sysupgrade -n', '    ```', '', 'Done.'].join('\n');
    const { text: protectedText, blocks } = protectCode(text);
    expect(protectedText).toContain('@@CODE_0@@');
    expect(protectedText).not.toContain('```');
    expect(blocks).toEqual(['    ```bash\n    sysupgrade -n\n    ```']);
    expect(restoreCode(protectedText, blocks)).toBe(text);
  });

  it('restoreCode returns the original text', () => {
    const { text, blocks } = protectCode(docWithFences);
    expect(restoreCode(text, blocks)).toBe(docWithFences);
  });
});

describe('validate', () => {
  const { text: source, blocks } = protectCode(splitFrontmatter(docWithFences).body);

  it('accepts a faithful translation', () => {
    const translated = [
      'Intro com [um link](guides/foo.md) e `code` inline.',
      '',
      '@@CODE_0@@',
      '',
      'Entre cercas.',
      '',
      '@@CODE_1@@',
      '',
      '## Hardware',
      '',
      '| Modelo | RAM |',
      '| ----- | --- |',
      '| NUC | 8GB |',
      '',
      'Fim.',
    ].join('\n');
    expect(validate(source, translated, blocks)).toEqual({ ok: true });
  });

  it('fails when a link target changes', () => {
    const translated = source.replace('(guides/foo.md)', '(guias/foo.md)');
    const result = validate(source, translated, blocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('link targets');
  });

  it('fails when a placeholder is missing', () => {
    const translated = source.replace('@@CODE_1@@', 'código omitido');
    const result = validate(source, translated, blocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('@@CODE_1@@');
  });

  it('fails when a placeholder is duplicated', () => {
    const translated = source.replace('@@CODE_1@@', '@@CODE_0@@');
    const result = validate(source, translated, blocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('@@CODE_0@@');
  });

  it('fails when the table row count changes', () => {
    const translated = source.replace('| NUC | 8GB |\n', '');
    const result = validate(source, translated, blocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('table row count');
  });

  it('fails when the heading count changes', () => {
    const translated = `${source}\n\n## Extra heading`;
    const result = validate(source, translated, blocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('heading count');
  });

  it('fails when a stray code fence appears', () => {
    const translated = `${source}\n\n\`\`\`\nstray\n\`\`\``;
    const result = validate(source, translated, blocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('code fence count');
  });

  it('fails when inline code spans change', () => {
    const src = protectCode('Use `foo` and `bar` here.').text;
    const translated = 'Use `foo` and `baz` here.';
    const result = validate(src, translated, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('inline code spans');
  });

  it('accepts reordered but unchanged inline code spans', () => {
    const src = protectCode('Use `foo` then `bar` here.').text;
    const translated = 'Use `bar` e depois `foo` aqui.';
    expect(validate(src, translated, [])).toEqual({ ok: true });
  });

  it('fails when per-row table pipe counts change', () => {
    const src = protectCode('| Model | RAM |\n| ----- | --- |\n| NUC | 8GB |').text;
    const translated = '| Modelo RAM |\n| --------- |\n| NUC 8GB |';
    const result = validate(src, translated, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('table pipe counts');
  });

  it('fails when a table separator row stops being one', () => {
    const src = protectCode('| Model | RAM |\n| ----- | --- |\n| NUC | 8GB |').text;
    const translated = '| Modelo | RAM |\n| xx | yy |\n| NUC | 8GB |';
    const result = validate(src, translated, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('table separator');
  });

  it('fails when heading levels change while the count stays equal', () => {
    const src = protectCode('## First\n\nOne.\n\n### Second\n\nTwo.').text;
    const translated = '### Primeiro\n\nUm.\n\n## Segundo\n\nDois.';
    const result = validate(src, translated, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('heading level sequence');
  });

  it('fails when the non-code text shrinks below half the source length', () => {
    const src = protectCode(`Intro prose. ${'More English words follow here. '.repeat(10)}`).text;
    const translated = 'Curto.';
    const result = validate(src, translated, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('length ratio');
  });

  it('fails when the non-code text grows beyond twice the source length', () => {
    const src = protectCode('Short intro.').text;
    const translated = `Introdução. ${'Palavras portuguesas adicionais continuam aqui. '.repeat(20)}`;
    const result = validate(src, translated, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('length ratio');
  });

  it('fails when a long translation is identical to the source', () => {
    const src = protectCode(
      'This paragraph is long enough to be unmistakably untranslated prose. '.repeat(5)
    ).text;
    const result = validate(src, src, []);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('identical');
  });

  it('accepts an identical translation when the source is short', () => {
    const src = protectCode('Short unchanged snippet with a `command`.').text;
    expect(validate(src, src, [])).toEqual({ ok: true });
  });
});

describe('chunkBody', () => {
  it('returns a single chunk for small bodies', () => {
    expect(chunkBody('short body')).toEqual(['short body']);
  });

  it('splits long bodies at section boundaries within the limit', () => {
    const sections = Array.from({ length: 20 }, (_, i) => `## Section ${i}\n${'x'.repeat(500)}`);
    const long = `# Title\n\n${sections.join('\n\n')}`;
    const chunks = chunkBody(long, 8000);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(8000);
    }
    for (const chunk of chunks.slice(1)) {
      expect(chunk.startsWith('## ')).toBe(true);
    }
    expect(chunks.join('\n')).toBe(long);
  });

  it('keeps an oversized single section as one chunk', () => {
    const huge = `## Only section\n${'y'.repeat(9000)}`;
    expect(chunkBody(huge, 8000)).toEqual([huge]);
  });
});

describe('actionFor', () => {
  const raw = '---\ntitle: About\n---\n\nEnglish body.\n';
  const hash = sourceHash(raw);

  it('plans a translation when the target does not exist', () => {
    expect(actionFor(null, hash)).toEqual({ action: 'translate', reason: 'missing' });
  });

  it('skips when the target sourceHash matches', () => {
    const target = `---\ntitle: Sobre\nsourcePath: about.md\nsourceHash: ${hash}\ntranslatedBy: test\n---\n\nCorpo.\n`;
    expect(actionFor(target, hash)).toEqual({ action: 'skip', reason: 'up-to-date' });
  });

  it('retranslates a stale target', () => {
    const target = `---\ntitle: Sobre\nsourcePath: about.md\nsourceHash: 0000000000000000\ntranslatedBy: test\n---\n\nCorpo.\n`;
    expect(actionFor(target, hash)).toEqual({ action: 'translate', reason: 'stale' });
  });

  it('retranslates an up-to-date target when forced', () => {
    const target = `---\ntitle: Sobre\nsourcePath: about.md\nsourceHash: ${hash}\ntranslatedBy: test\n---\n\nCorpo.\n`;
    expect(actionFor(target, hash, true)).toEqual({ action: 'translate', reason: 'forced' });
  });
});

describe('readManifest', () => {
  it('normalizes, dedupes and sorts the docs list', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'cb-manifest-'));
    try {
      const file = path.join(dir, 'manifest.json');
      await writeFile(file, JSON.stringify({ docs: ['b.md', '/a', 'a'] }), 'utf8');
      expect(await readManifest(file)).toEqual(['a', 'b']);
      await expect(readManifest(path.join(dir, 'missing.json'))).rejects.toThrow(/Manifest not found/);
      await writeFile(file, JSON.stringify({ docs: [] }), 'utf8');
      await expect(readManifest(file)).rejects.toThrow(/Manifest must be/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe('protectInlineCode', () => {
  it('replaces inline spans after fenced blocks and restores them', () => {
    const body = 'Run `sudo fdisk /dev/sdb`:\n\n```bash\nls\n```\n\nSee `[Shot](a.png)`.';
    const prot = protectInlineCode(protectCode(body));
    expect(prot.text).toBe('Run @@CODE_1@@:\n\n@@CODE_0@@\n\nSee @@CODE_2@@.');
    expect(restoreCode(prot.text, prot.blocks)).toBe(body);
  });
});

describe('fenceInfoString / isProseBlock', () => {
  it('treats untagged and text/txt/plaintext fences as prose', () => {
    expect(fenceInfoString('```\nfoo\n```')).toBe('');
    expect(isProseBlock('```\nfoo\n```')).toBe(true);
    expect(isProseBlock('```text\nfoo\n```')).toBe(true);
    expect(isProseBlock('```TXT\nfoo\n```')).toBe(true);
    expect(isProseBlock('~~~plaintext\nfoo\n~~~')).toBe(true);
    expect(isProseBlock('   ```\n   foo\n   ```')).toBe(true);
  });

  it('treats language-tagged fences as technical', () => {
    expect(fenceInfoString('```bash\nls\n```')).toBe('bash');
    expect(isProseBlock('```bash\nls\n```')).toBe(false);
    expect(isProseBlock('~~~yaml\na: b\n~~~')).toBe(false);
  });
});

describe('splitFencedBlock', () => {
  it('splits opening fence, inner lines and closing fence', () => {
    const block = '   ```\n   Press F2\n   Save and exit\n   ```';
    expect(splitFencedBlock(block)).toEqual({
      open: '   ```',
      inner: '   Press F2\n   Save and exit',
      close: '   ```',
    });
  });

  it('returns a null close for a block without a closing fence', () => {
    expect(splitFencedBlock('```\nruns to the end of the file')).toEqual({
      open: '```',
      inner: 'runs to the end of the file',
      close: null,
    });
  });
});

describe('proseBlockCandidates', () => {
  it('selects closed prose fences with content only', () => {
    const body = [
      'Intro.',
      '',
      '```',
      'Press F2 to open Setup',
      '```',
      '',
      '```bash',
      'sudo apt update',
      '```',
      '',
      '```text',
      '',
      '```',
    ].join('\n');
    const { blocks } = protectCode(body);
    const candidates = proseBlockCandidates(blocks);
    expect(candidates.map((candidate) => candidate.index)).toEqual([0]);
    expect(candidates[0].inner).toBe('Press F2 to open Setup');
  });
});

describe('proseBlockPrompt', () => {
  it('names the language and the unchanged-technical rule', () => {
    const prompt = proseBlockPrompt('Brazilian Portuguese');
    expect(prompt).toContain('Brazilian Portuguese');
    expect(prompt).toContain('unchanged');
    expect(prompt).toContain('@@BLOCK_n@@');
  });
});

describe('parseProseBlockResponse', () => {
  it('collects each block content after its header', () => {
    const response = ['@@BLOCK_2@@', 'Primeira linha', 'Segunda linha', '@@BLOCK_0@@', 'Outra linha'].join('\n');
    expect(parseProseBlockResponse(response, [2, 0])).toEqual(
      new Map([
        [2, 'Primeira linha\nSegunda linha'],
        [0, 'Outra linha'],
      ])
    );
  });

  it('rejects missing, unknown, duplicated headers and leading content', () => {
    expect(parseProseBlockResponse('@@BLOCK_0@@\nline', [0, 1])).toBeNull();
    expect(parseProseBlockResponse('@@BLOCK_5@@\nline', [0])).toBeNull();
    expect(parseProseBlockResponse('@@BLOCK_0@@\na\n@@BLOCK_0@@\nb', [0])).toBeNull();
    expect(parseProseBlockResponse('preamble\n@@BLOCK_0@@\na', [0])).toBeNull();
  });
});

describe('validateProseBlock', () => {
  it('accepts a translation that keeps lines, indentation and URLs', () => {
    const source = 'Press F2 to enter Setup\n  See http://example.com/setup\nSelect "Boot Menu"';
    const translated = 'Pressione F2 para entrar na Configuração\n  Veja http://example.com/setup\nSelecione "Boot Menu"';
    expect(validateProseBlock(source, translated)).toEqual({ ok: true });
  });

  it('accepts an unchanged purely technical block', () => {
    const inner = 'sudo dd if=image.bin of=/dev/sdb bs=4M conv=fsync';
    expect(validateProseBlock(inner, inner)).toEqual({ ok: true });
  });

  it('fails when the line count changes', () => {
    expect(validateProseBlock('one\ntwo', 'um').ok).toBe(false);
  });

  it('fails when leading indentation changes', () => {
    expect(validateProseBlock('  Push pins up', 'Gire os pinos').ok).toBe(false);
  });

  it('fails when the translation introduces a code fence', () => {
    expect(validateProseBlock('Rotate 90 degrees', '```\nGire 90 graus').ok).toBe(false);
  });

  it('fails when a URL changes or disappears', () => {
    expect(validateProseBlock('Open http://a.example/x', 'Abra http://b.example/x').ok).toBe(false);
    expect(validateProseBlock('Open http://a.example/x', 'Abra o painel').ok).toBe(false);
  });
});

describe('applyProseTranslations', () => {
  const body = [
    'Steps:',
    '',
    '```',
    'Press F2 to open Setup',
    'Save changes and exit',
    '```',
    '',
    '1. Cooler:',
    '',
    '    ```',
    '    Push-pin coolers: rotate pins 90 degrees',
    '    ```',
  ].join('\n');

  it('replaces prose blocks in place, keeping fence lines and indentation', () => {
    const { text, blocks } = protectCode(body);
    const applied = applyProseTranslations(
      blocks,
      new Map([
        [0, 'Pressione F2 para abrir a Configuração\nSalve as alterações e saia'],
        [1, '    Refrigeradores push-pin: gire os pinos 90 graus'],
      ])
    );
    expect(applied).toBe(2);
    expect(blocks[0]).toBe('```\nPressione F2 para abrir a Configuração\nSalve as alterações e saia\n```');
    expect(blocks[1]).toBe('    ```\n    Refrigeradores push-pin: gire os pinos 90 graus\n    ```');
    expect(restoreCode(text, blocks)).toContain('Refrigeradores push-pin');
  });

  it('keeps English for translations that fail validation', () => {
    const { blocks } = protectCode(body);
    const applied = applyProseTranslations(
      blocks,
      new Map([
        [0, 'uma linha apenas'],
        [1, 'linhas\nextra'],
      ])
    );
    expect(applied).toBe(0);
    expect(blocks[0]).toBe('```\nPress F2 to open Setup\nSave changes and exit\n```');
    expect(blocks[1]).toBe('    ```\n    Push-pin coolers: rotate pins 90 degrees\n    ```');
  });

  it('leaves tagged blocks untouched even when given a translation', () => {
    const { blocks } = protectCode('```bash\napt update\n```');
    expect(applyProseTranslations(blocks, new Map([[0, 'apt atualizar']]))).toBe(0);
    expect(blocks[0]).toBe('```bash\napt update\n```');
  });
});

describe('compareBlocks', () => {
  it('accepts identical tagged blocks and translated prose blocks', () => {
    const sourceBody = '```bash\nsudo apt update\n```\n\n```\nPress F2 to open Setup\nSave changes and exit\n```';
    const targetBody =
      '```bash\nsudo apt update\n```\n\n```\nPressione F2 para abrir a Configuração\nSalve as alterações e saia\n```';
    const { blocks: sourceBlocks } = protectCode(sourceBody);
    const { blocks: targetBlocks } = protectCode(targetBody);
    expect(compareBlocks(sourceBlocks, targetBlocks)).toEqual({ ok: true });
  });

  it('fails when a tagged block is altered', () => {
    const { blocks } = protectCode('```bash\nsudo apt update\n```');
    const { blocks: targetBlocks } = protectCode('```bash\nsudo apt full-upgrade\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('tagged blocks must stay identical');
  });

  it('regression: an altered tagged command passes validate() but fails compareBlocks()', () => {
    const body = 'Run the update:\n\n```bash\nsudo apt update\n```';
    const { text: sourceProtected, blocks: sourceBlocks } = protectCode(body);
    const { text: targetProtected, blocks: targetBlocks } = protectCode(body.replace('sudo apt update', 'sudo rm -rf /'));
    // Doc-level validation restores both sides with the source blocks, so it cannot see the change.
    expect(validate(sourceProtected, targetProtected, sourceBlocks).ok).toBe(true);
    const result = compareBlocks(sourceBlocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('fenced block 0');
  });

  it('fails when a prose block line count changes', () => {
    const { blocks } = protectCode('```\nline one\nline two\n```');
    const { blocks: targetBlocks } = protectCode('```\numa linha\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('must keep 4 line(s)');
  });

  it('fails when the block count differs', () => {
    const { blocks } = protectCode('```\na\n```');
    const { blocks: targetBlocks } = protectCode('```\na\n```\n\n```\nb\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('fenced block count mismatch');
  });
});

describe('redactSecret / sanitizeBody', () => {
  it('replaces every occurrence of the secret', () => {
    expect(redactSecret('denied for sk-test-123 (sk-test-123)', 'sk-test-123')).toBe('denied for *** (***)');
    expect(redactSecret('no secret here', 'sk-test-123')).toBe('no secret here');
    expect(redactSecret('nothing to redact', '')).toBe('nothing to redact');
  });

  it('caps provider bodies at 200 chars after redaction', () => {
    const secret = 'zai-secret-key';
    const body = `error: key ${secret} invalid ${'x'.repeat(300)}`;
    const sanitized = sanitizeBody(body, secret);
    expect(sanitized.length).toBe(200);
    expect(sanitized.startsWith('error: key *** invalid')).toBe(true);
    expect(sanitized).not.toContain(secret);
    expect(sanitizeBody('short body', secret)).toBe('short body');
  });
});
