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
  firmwareValuesCoveredPerLine,
  isCommandLine,
  isMostlyTechnicalBlock,
  isProseBlock,
  isTechnicalLine,
  isTranslatableProseLine,
  menuPathsCovered,
  menuPathsIn,
  parseProseBlockResponse,
  proseBlockCandidates,
  proseBlockPrompt,
  protectCode,
  protectInlineCode,
  protectTechnicalLines,
  readManifest,
  redactSecret,
  restoreCode,
  restoreTechnicalLines,
  sanitizeBody,
  sourceHash,
  splitFencedBlock,
  technicalLineTokens,
  technicalTokensMatch,
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

  it('regression: sudo apt update must not drift to sudo apt upgrade', () => {
    const result = validateProseBlock('$ sudo apt update', '$ sudo apt upgrade');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('technical tokens');
    expect(validateProseBlock('sudo apt update', 'sudo apt upgrade').ok).toBe(false);
  });

  it('still accepts a translated mixed block that keeps commands and key names', () => {
    const source = ['Update the packages:', 'sudo apt update', 'Then press F2 to open Setup'].join('\n');
    const translated = ['Atualize os pacotes:', 'sudo apt update', 'Depois pressione F2 para abrir a Configuração'].join('\n');
    expect(validateProseBlock(source, translated)).toEqual({ ok: true });
  });

  it('still accepts a prose block without any technical tokens', () => {
    expect(validateProseBlock('Push-pin coolers: rotate pins 90 degrees', 'Coolers push-pin: gire os pinos 90 graus')).toEqual({
      ok: true,
    });
  });

  it('fails when a path, quoted label or underscore token is altered', () => {
    expect(validateProseBlock('Edit /etc/config/wireless', 'Edite /etc/config/sem-fio').ok).toBe(false);
    expect(validateProseBlock('Open "Boot Menu"', 'Abra "Menu de Inicialização"').ok).toBe(false);
    expect(validateProseBlock('Check the disk_serial value', 'Verifique o valor serial_do_disco').ok).toBe(false);
  });

  it('accepts a decimal-comma number with units as equivalent', () => {
    expect(validateProseBlock('The CPU runs at 2.4GHz', 'A CPU roda a 2,4GHz')).toEqual({ ok: true });
  });
});

describe('isCommandLine / technicalLineTokens', () => {
  it('treats $ prompts, shebangs, sudo and common CLI words as whole-line commands', () => {
    expect(isCommandLine('$ sudo apt update')).toBe(true);
    expect(isCommandLine('#!/bin/bash')).toBe(true);
    expect(isCommandLine('sudo dd if=img.bin of=/dev/sdb bs=4M')).toBe(true);
    expect(isCommandLine('mkfs.ext4 /dev/sdb1')).toBe(true);
    expect(isCommandLine('    opkg install wireguard-tools')).toBe(true);
    expect(technicalLineTokens('    sudo apt update')).toEqual(['sudo apt update']);
  });

  it('does not classify capitalized or mid-sentence words as commands', () => {
    expect(isCommandLine('Mount the disk')).toBe(false);
    expect(isCommandLine('Docker containers appear here')).toBe(false);
  });

  it('extracts the technical tokens of a prose line in order', () => {
    expect(technicalLineTokens('Press F2, then Del, then Enter or Tab')).toEqual(['F2', 'Del', 'Enter', 'Tab']);
    expect(technicalLineTokens('See http://example.com/x for details')).toEqual(['http://example.com/x']);
    // a line holding a bare path token is technical as a whole (default-technical gate)
    expect(technicalLineTokens('See http://example.com/x and /etc/config/wireless.')).toEqual([
      'See http://example.com/x and /etc/config/wireless.',
    ]);
    // '=' or a lowercase first word makes the whole line technical
    expect(technicalLineTokens('Set net.ifnames=0 and pass --force or -v')).toEqual([
      'Set net.ifnames=0 and pass --force or -v',
    ]);
    expect(technicalLineTokens('address fe80::1, MAC 00:11:22:33:44:55, value 0x1F')).toEqual([
      'address fe80::1, MAC 00:11:22:33:44:55, value 0x1F',
    ]);
    expect(technicalLineTokens('Ping 192.168.1.1 on 10.0.0.0/24 via 10.0.0.1:8080')).toEqual([
      '192.168.1.1',
      '10.0.0.0/24',
      '10.0.0.1:8080',
    ]);
    expect(technicalLineTokens('Pass --force or -v when asked')).toEqual(['--force', '-v']);
    expect(technicalLineTokens('Choose "Boot Menu" then disk_serial at 512MB and 19V')).toEqual([
      '"Boot Menu"',
      'disk_serial',
      '512MB',
      '19V',
    ]);
    expect(technicalLineTokens('Push-pin coolers: rotate pins 90 degrees')).toEqual([]);
  });

  it('ignores apostrophes that are not quoted tokens', () => {
    expect(technicalLineTokens("The router's menu doesn't list 'Boot'")).toEqual(["'Boot'"]);
  });
});

describe('technicalTokensMatch', () => {
  it('passes when every line keeps its tokens in order', () => {
    const source = 'sudo apt update\nPress F2 to open Setup';
    const translated = 'sudo apt update\nPressione F2 para abrir a Configuração';
    expect(technicalTokensMatch(source, translated)).toEqual({ ok: true });
  });

  it('fails on the first line whose token sequence changed', () => {
    const result = technicalTokensMatch('sudo apt update\nplain prose', 'sudo apt upgrade\nprosa simples');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('line 1');
    expect(result.reason).toContain('sudo apt update');
    expect(result.reason).toContain('sudo apt upgrade');
  });

  it('fails when tokens are reordered', () => {
    const result = technicalTokensMatch('first /dev/sda then /dev/sdb', 'primeiro /dev/sdb depois /dev/sda');
    expect(result.ok).toBe(false);
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

  it('regression: an altered command inside an untagged block fails compareBlocks()', () => {
    const { blocks } = protectCode('```\nsudo apt update\n```');
    const { blocks: targetBlocks } = protectCode('```\nsudo apt upgrade\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('technical tokens');
    expect(result.reason).toContain('sudo apt update');
  });

  it('accepts an untagged block whose translation keeps every technical token', () => {
    const { blocks } = protectCode('```\nPress F2 to open Setup\n```');
    const { blocks: targetBlocks } = protectCode('```\nPressione F2 para abrir a Configuração\n```');
    expect(compareBlocks(blocks, targetBlocks)).toEqual({ ok: true });
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

describe('isTechnicalLine', () => {
  it('treats executable paths, UCI statements, config pairs and prompts as whole technical lines', () => {
    expect(isTechnicalLine('/etc/init.d/dnsmasq restart')).toBe(true);
    expect(isTechnicalLine('    /etc/init.d/domain-aliases restart')).toBe(true);
    expect(isTechnicalLine('./flash.sh /tmp/image.bin')).toBe(true);
    expect(isTechnicalLine('../tools/setup.sh')).toBe(true);
    expect(isTechnicalLine('~/bin/backup.sh')).toBe(true);
    expect(isTechnicalLine('config dnsmasq')).toBe(true);
    expect(isTechnicalLine("    option cachesize '1000'")).toBe(true);
    expect(isTechnicalLine("    list server '8.8.8.8'")).toBe(true);
    expect(isTechnicalLine('UUID=12345678-1234-1234-1234-123456789012 /srv ext4 defaults 0 2')).toBe(true);
    expect(isTechnicalLine('net.ifnames=0')).toBe(true);
    expect(isTechnicalLine('cachesize: 1000')).toBe(true);
    expect(isTechnicalLine('# External backup storage')).toBe(true);
    expect(isTechnicalLine('root@router:~# opkg update')).toBe(true);
    expect(isTechnicalLine('> systemctl status dnsmasq')).toBe(true);
    expect(isTechnicalLine('$ sudo apt update')).toBe(true);
  });

  it('does not classify firmware prose labels or plain prose as technical lines', () => {
    expect(isTechnicalLine('Navigation: Advanced → Security → Passwords')).toBe(false);
    expect(isTechnicalLine('Setting: Disabled')).toBe(false);
    expect(isTechnicalLine('mSATA: Similar to M.2 but smaller form factor')).toBe(false);
    expect(isTechnicalLine('2.5" SATA: Remove bracket screws, disconnect cable')).toBe(false);
    expect(isTechnicalLine('Mount the disk')).toBe(false);
    expect(isTechnicalLine('')).toBe(false);
  });
});

describe('technical tokens of whole technical lines (gate regressions)', () => {
  it('regression: /etc/init.d/dnsmasq restart must not drift to ... stop', () => {
    expect(technicalLineTokens('/etc/init.d/dnsmasq restart')).toEqual(['/etc/init.d/dnsmasq restart']);
    const result = validateProseBlock('/etc/init.d/dnsmasq restart', '/etc/init.d/dnsmasq stop');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('technical tokens');
    expect(result.reason).toContain('/etc/init.d/dnsmasq restart');
  });

  it('regression: option cachesize must not drift to option bogus', () => {
    const source = ["config dnsmasq", "    option cachesize '1000'", "    option min_cache_ttl '3600'"].join('\n');
    const drifted = ["config dnsmasq", "    option bogus '1000'", "    option min_cache_ttl '3600'"].join('\n');
    expect(technicalLineTokens("    option cachesize '1000'")).toEqual(["option cachesize '1000'"]);
    const result = validateProseBlock(source, drifted);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("option cachesize '1000'");
  });

  it('regression: compareBlocks rejects both drifts in translated files', () => {
    const dns = '```\n/etc/init.d/dnsmasq restart\n```';
    const { blocks: dnsSource } = protectCode(dns);
    const { blocks: dnsDrifted } = protectCode('```\n/etc/init.d/dnsmasq stop\n```');
    expect(compareBlocks(dnsSource, dnsDrifted).ok).toBe(false);

    const uci = "```\nconfig dnsmasq\n    option cachesize '1000'\n```";
    const { blocks: uciSource } = protectCode(uci);
    const { blocks: uciDrifted } = protectCode("```\nconfig dnsmasq\n    option bogus '1000'\n```");
    const result = compareBlocks(uciSource, uciDrifted);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("option cachesize '1000'");
  });
});

describe('isMostlyTechnicalBlock / proseBlockCandidates', () => {
  it('keeps mostly-technical fences in English instead of translating them', () => {
    const inner = ["config dnsmasq", "    option cachesize '1000'", "    option min_cache_ttl '3600'"].join('\n');
    expect(isMostlyTechnicalBlock(inner)).toBe(true);
    expect(isMostlyTechnicalBlock('/etc/init.d/dnsmasq restart')).toBe(true);
    expect(isMostlyTechnicalBlock('UUID=12345678-1234 /srv ext4 defaults 0 2')).toBe(true);

    const body = ['Steps:', '', '```', ...inner.split('\n'), '```', ''].join('\n');
    const { blocks } = protectCode(body);
    expect(proseBlockCandidates(blocks)).toEqual([]);
  });

  it('still translates mixed fences whose majority is prose', () => {
    const inner = ['Navigation: Advanced → Security → Secure Boot', 'Setting: Disabled', 'Reason: Many Linux distributions require Secure Boot disabled'].join('\n');
    expect(isMostlyTechnicalBlock(inner)).toBe(false);
    const body = ['```\n', inner, '\n```'].join('');
    const { blocks } = protectCode(body);
    expect(proseBlockCandidates(blocks).map((candidate) => candidate.index)).toEqual([0]);
  });
});

describe('menuPathsIn / menuPathsCovered', () => {
  it('extracts arrow-joined Title-Case paths and quoted menu labels, ignoring bold', () => {
    expect(menuPathsIn('Navigation: Advanced → Security → Passwords → Set Supervisor Password')).toEqual([
      'Advanced → Security → Passwords → Set Supervisor Password',
    ]);
    expect(menuPathsIn('Go to **Device** → **Create Partition Table**')).toEqual(['Device → Create Partition Table']);
    expect(menuPathsIn('Choose Main » Boot Options')).toEqual(['Choose Main » Boot Options']);
    expect(menuPathsIn('Enter Setup -> Save Changes')).toEqual(['Enter Setup -> Save Changes']);
    expect(menuPathsIn('Device Manager > IDE ATA/ATAPI controllers')).toEqual(['Device Manager > IDE ATA/ATAPI']);
    expect(menuPathsIn('Select "BIOS Setup" from the menu')).toEqual(['BIOS Setup']);
    expect(menuPathsIn('System → Backup/Flash Firmware')).toEqual(['System → Backup/Flash Firmware']);
  });

  it('does not extract power ranges, wiring diagrams or prose', () => {
    expect(menuPathsIn('Raspberry Pi 4: 5W → 85W (1-16 nodes)')).toEqual([]);
    expect(menuPathsIn('GND     <--->   GND')).toEqual([]);
    expect(menuPathsIn('The Quick Brown Fox jumps over the lazy dog')).toEqual([]);
    expect(menuPathsIn('Update the packages:')).toEqual([]);
  });

  it('accepts a parenthetical translation after the English path but not a translated path', () => {
    const source = 'Navigation: Advanced → Security → Passwords';
    const kept = 'Navegação: Advanced → Security → Passwords (Avançado → Segurança → Senhas)';
    expect(menuPathsCovered(source, kept)).toEqual({ ok: true });
    expect(menuPathsCovered(source, 'Navegação: Avançado → Segurança → Senhas').ok).toBe(false);
    expect(validateProseBlock(source, kept)).toEqual({ ok: true });
    const result = validateProseBlock(source, 'Navegação: Avançado → Segurança → Senhas');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('menu path or quoted label changed');
  });

  it('requires repeated paths to survive with their multiplicity', () => {
    expect(menuPathsCovered('NO → Continue\nNO → Continue', 'SIM → Continuar').ok).toBe(false);
    expect(menuPathsCovered('NO → Continue\nNO → Continue', 'NO → Continue\nNO → Continue')).toEqual({ ok: true });
  });

  it('accepts the English label moved into an unquoted parenthetical', () => {
    expect(menuPathsCovered('Use "Safely Remove" to eject', 'Use "Remover com segurança" (Safely Remove) para ejetar')).toEqual({ ok: true });
    expect(menuPathsCovered('Use "Safely Remove" to eject', 'Use "Remover com segurança" para ejetar').ok).toBe(false);
  });
});

describe('hardening extensions (codex critique round)', () => {
  it('treats OpenWrt log commands and hosts-file entries as whole technical lines', () => {
    expect(isTechnicalLine('logread | grep dnsmasq')).toBe(true);
    expect(isTechnicalLine('tcpdump -i any port 53')).toBe(true);
    expect(isTechnicalLine('192.168.1.10   mediaserver.mesh')).toBe(true);
    expect(isTechnicalLine('192.168.1.20   wiki.mesh')).toBe(true);
    // default-technical gate: a prose line starting with an IP never reaches the model
    expect(isTechnicalLine('192.168.1.1 is the default gateway')).toBe(true);
  });

  it('regression: logread | grep dnsmasq and hosts entries must not drift', () => {
    const logResult = validateProseBlock('logread | grep dnsmasq', 'logread | grep dnsmasq2');
    expect(logResult.ok).toBe(false);
    expect(logResult.reason).toContain('logread | grep dnsmasq');
    expect(validateProseBlock('192.168.1.10   mediaserver.mesh', '192.168.1.10   servidor.mesh').ok).toBe(false);
  });

  it('protects quoted on-screen labels with lowercase words', () => {
    expect(menuPathsIn('Click "Flash from file" (the first button)')).toEqual(['Flash from file']);
    expect(menuPathsIn('Press "Flash!" to start')).toEqual(['Flash!']);
    expect(menuPathsIn('Apps show "Not compatible with devices"')).toEqual(['Not compatible with devices']);
    expect(menuPathsCovered('Click "Flash from file"', 'Clique em "Flash from file" (Flash do arquivo)').ok).toBe(true);
    expect(menuPathsCovered('Click "Flash from file"', 'Clique em "Flash do arquivo"').ok).toBe(false);
  });

  it('tolerates parenthetical translations inside quotes and localized quote styles', () => {
    expect(menuPathsIn('Hold Shift while clicking "Restart (Reiniciar)"')).toEqual(['Restart']);
    expect(menuPathsCovered('Clicking "Restart"', 'Clicando em "Restart (Reiniciar)"')).toEqual({ ok: true });
    // the English label may move into the parenthetical, but must survive somewhere
    expect(menuPathsCovered('Clicking "Restart"', 'Clicando em "Reiniciar (Restart)"')).toEqual({ ok: true });
    expect(menuPathsCovered('Clicking "Restart"', 'Clicando em "Reiniciar"').ok).toBe(false);
    expect(menuPathsIn('Clique em "Flash from file" agora')).toEqual(['Flash from file']);
    expect(menuPathsIn('Clique em "Flash!" agora')).toEqual(['Flash!']);
  });

  it('protects firmware setting values after a labeled colon', () => {
    expect(menuPathsIn('Setting: Disabled')).toEqual(['Disabled']);
    expect(menuPathsIn('Wake on LAN: Enabled')).toEqual(['Enabled']);
    expect(menuPathsIn('After Power Failure: Power On')).toEqual(['Power On']);
    expect(menuPathsIn('SATA Mode: AHCI')).toEqual(['AHCI']);
    expect(menuPathsIn('- Network Boot: Disabled (unless PXE booting required)')).toEqual(['Disabled']);
    // prose after the colon that merely starts with the word is not captured
    expect(menuPathsIn('- **Thermal Throttling**: Performance reduction under sustained high loads')).toEqual([]);
    expect(menuPathsIn('- **Budget**: Performance-focused investment')).toEqual([]);
    // a kept value passes even when its label is translated
    expect(validateProseBlock('Setting: Disabled', 'Ajuste: Disabled (Desativado)')).toEqual({ ok: true });
    const result = validateProseBlock('Setting: Disabled', 'Ajuste: Ativado');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('Disabled');
    // a longer translated word does not satisfy a short value (word boundaries)
    expect(menuPathsCovered('Profile: Auto', 'Perfil: Automaticamente').ok).toBe(false);
    expect(menuPathsCovered('Profile: Auto', 'Perfil: Auto (Automático)')).toEqual({ ok: true });
  });
});

describe('menu paths in body text and translated files', () => {
  it('validate() keeps body menu paths and quoted labels in English', () => {
    const src = protectCode('Open the menu: **Troubleshoot** → **Advanced Options** and click "Restart" now.').text;
    const kept = 'Abra o menu: **Troubleshoot** → **Advanced Options** (Solucionar → Opções Avançadas) e clique em "Restart" (Reiniciar) agora.';
    expect(validate(src, kept, [])).toEqual({ ok: true });

    const translatedPath = 'Abra o menu: **Solucionar Problemas** → **Opções Avançadas** e clique em "Restart" agora.';
    const failPath = validate(src, translatedPath, []);
    expect(failPath.ok).toBe(false);
    expect(failPath.reason).toContain('menu path or quoted label changed');

    const translatedLabel = 'Abra o menu: **Troubleshoot** → **Advanced Options** e clique em "Reiniciar" agora.';
    const failLabel = validate(src, translatedLabel, []);
    expect(failLabel.ok).toBe(false);
    expect(failLabel.reason).toContain('menu path or quoted label changed');
  });

  it('compareBlocks rejects a translated menu path inside an untagged fence', () => {
    const source = '```\nNavigation: Advanced → Power → Secondary Power Settings\n```';
    const { blocks } = protectCode(source);
    const { blocks: targetBlocks } = protectCode('```\nNavegação: Avançado → Energia → Ajustes de Energia\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('menu path or quoted label changed');
    expect(result.reason).toContain('Advanced → Power → Secondary Power Settings');
  });

  it('regression (gate item 4): the pt BIOS guide menu path stays in English', () => {
    const source = '```\nNavigation: Advanced → Security → Passwords → Set Supervisor Password\nRecommended: 12+ character password\n```';
    const target = [
      'Navegação: Advanced → Security → Passwords → Set Supervisor Password (Avançado → Segurança → Senhas → Definir Senha do Supervisor)',
      'Recomendado: senha de 12+ caracteres',
    ].join('\n');
    const { blocks: sourceBlocks } = protectCode(source);
    const { blocks: targetBlocks } = protectCode(`\`\`\`\n${target}\n\`\`\``);
    expect(compareBlocks(sourceBlocks, targetBlocks)).toEqual({ ok: true });
  });
});

describe('isTranslatableProseLine (default-technical gate)', () => {
  it('keeps commands with any first word technical, allowlist or not', () => {
    expect(isTranslatableProseLine('nmcli connection up community')).toBe(false);
    expect(isTranslatableProseLine('sudo systemctl restart dnsmasq')).toBe(false);
    expect(isTranslatableProseLine('ip addr')).toBe(false);
    expect(isTranslatableProseLine('mkfs.ext4 /dev/sdb1')).toBe(false);
    expect(isTechnicalLine('nmcli connection up community')).toBe(true);
  });

  it('allows uppercase prose, label lines and list markers through', () => {
    expect(isTranslatableProseLine('Press F2 to open Setup')).toBe(true);
    expect(isTranslatableProseLine('mSATA: Similar to M.2 but smaller form factor')).toBe(true);
    expect(isTranslatableProseLine('2.5" SATA: Remove bracket screws, disconnect cable')).toBe(true);
    expect(isTranslatableProseLine('- Ensures server restarts automatically after power outages')).toBe(true);
    expect(isTranslatableProseLine('1. Press F9 (Load BIOS Defaults)')).toBe(true);
    expect(isTranslatableProseLine('⚠️ CRITICAL: Hold fan blades stationary while cleaning')).toBe(true);
  });

  it('keeps symbol, metacharacter and path lines technical', () => {
    expect(isTranslatableProseLine('=====================================')).toBe(false);
    expect(isTranslatableProseLine('[ ] Socket match confirmed')).toBe(false);
    expect(isTranslatableProseLine('GND     <--->   GND')).toBe(false);
    expect(isTranslatableProseLine('Edit the file /etc/config/wireless now')).toBe(false);
    expect(isTranslatableProseLine('Run ./flash.sh first')).toBe(false);
    expect(isTranslatableProseLine('Backup with ~/bin/backup.sh nightly')).toBe(false);
    // a spaced slash is prose punctuation, not a path token
    expect(isTranslatableProseLine('Pressione F9 (Load BIOS Defaults / Carregar padrões do BIOS)')).toBe(true);
  });

  it('classifies translated lines too: Unicode uppercase starts are prose', () => {
    expect(isTranslatableProseLine('- Útil para una operación eficiente en energía')).toBe(true);
    expect(isTranslatableProseLine('Área de configuração do sistema')).toBe(true);
    expect(isTechnicalLine('- Útil para una operación eficiente en energía')).toBe(false);
  });
});

describe('protectTechnicalLines / restoreTechnicalLines', () => {
  it('replaces technical lines with placeholders that never contain the line', () => {
    const inner = ['Check the connection:', 'nmcli connection up community', 'Then verify routing'].join('\n');
    const { text, lines } = protectTechnicalLines(inner);
    expect(text).toBe('Check the connection:\n@@LINE_0@@\nThen verify routing');
    expect(text).not.toContain('nmcli');
    expect(lines).toEqual(['nmcli connection up community']);
  });

  it('keeps a technical line’s indentation outside the placeholder', () => {
    const { text } = protectTechnicalLines("Press enter\n    option cachesize '1000'");
    expect(text).toBe('Press enter\n    @@LINE_0@@');
  });

  it('restores placeholders verbatim in a round trip', () => {
    const inner = ['Update settings:', 'nmcli connection up community', 'Then reboot'].join('\n');
    const { text, lines } = protectTechnicalLines(inner);
    const restored = restoreTechnicalLines(text.replace('Update settings:', 'Atualize os ajustes:'), lines);
    expect(restored.ok).toBe(true);
    expect(restored.text).toBe(['Atualize os ajustes:', 'nmcli connection up community', 'Then reboot'].join('\n'));
  });

  it('rejects missing, duplicated, unknown and merged placeholders', () => {
    expect(restoreTechnicalLines('só prosa', ['nmcli connection up community']).ok).toBe(false);
    expect(restoreTechnicalLines('@@LINE_0@@\n@@LINE_0@@', ['cmd']).ok).toBe(false);
    expect(restoreTechnicalLines('@@LINE_1@@', ['cmd']).ok).toBe(false);
    expect(restoreTechnicalLines('Check @@LINE_0@@ now', ['cmd']).ok).toBe(false);
    // a block with no technical lines restores anything unchanged
    expect(restoreTechnicalLines('Plain prose', [])).toEqual({ text: 'Plain prose', ok: true });
  });
});

describe('third hardening (gate-terra items 3-5)', () => {
  it('regression: nmcli connection up community never reaches the model and cannot drift', () => {
    // the line is replaced by a placeholder before any request
    expect(protectTechnicalLines('nmcli connection up community').text).not.toContain('nmcli');
    // and translation-time plus file-checker validation both flag a drift
    const drifted = validateProseBlock('nmcli connection up community', 'nmcli connection down community');
    expect(drifted.ok).toBe(false);
    expect(drifted.reason).toContain('nmcli connection up community');
    const { blocks } = protectCode('```\nnmcli connection up community\n```');
    const { blocks: targetBlocks } = protectCode('```\nnmcli connection down community\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('nmcli connection up community');
  });

  it('accepts a mixed fence whose technical line came back restored verbatim', () => {
    const source = ['Check the connection:', 'nmcli connection up community', 'Then verify routing'].join('\n');
    const translated = ['Verifique a conexão:', 'nmcli connection up community', 'Depois verifique o roteamento'].join('\n');
    expect(validateProseBlock(source, translated)).toEqual({ ok: true });
  });

  it('regression: SpeedStep Enabled may not drift to Disabled while Turbo Mode keeps Enabled', () => {
    const source = ['Enhanced Intel SpeedStep: Enabled', 'Turbo Mode: Enabled'].join('\n');
    const drifted = ['Enhanced Intel SpeedStep: Disabled', 'Turbo Mode: Enabled'].join('\n');
    const result = firmwareValuesCoveredPerLine(source, drifted);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('line 1');
    expect(result.reason).toContain('Enabled');
    expect(validateProseBlock(source, drifted).ok).toBe(false);
    const { blocks } = protectCode(`\`\`\`\n${source}\n\`\`\``);
    const { blocks: targetBlocks } = protectCode(`\`\`\`\n${drifted}\n\`\`\``);
    expect(compareBlocks(blocks, targetBlocks).ok).toBe(false);
    // a faithful translation with a parenthetical gloss still passes
    const kept = ['Enhanced Intel SpeedStep: Enabled (Ativado)', 'Turbo Mode: Enabled (Ativado)'].join('\n');
    expect(validateProseBlock(source, kept)).toEqual({ ok: true });
  });

  it('protects On/Off and numeric firmware values on their own line', () => {
    expect(menuPathsIn('Wake on LAN: On')).toEqual(['On']);
    expect(firmwareValuesCoveredPerLine('Wake on LAN: On', 'Wake on LAN: Off').ok).toBe(false);
    expect(firmwareValuesCoveredPerLine('Threshold: 2.5', 'Limiar: 2,5')).toEqual({ ok: true });
    // values must stay on their line, not merely somewhere in the block
    expect(firmwareValuesCoveredPerLine('A: Auto\nB: On', 'A: On\nB: Auto').ok).toBe(false);
  });

  it('does not accept a changed value that only survives inside a parenthetical gloss', () => {
    expect(firmwareValuesCoveredPerLine('Turbo Mode: Enabled', 'Modo Turbo: Disabled (antes Enabled)').ok).toBe(false);
    // the English value before the gloss still passes
    expect(firmwareValuesCoveredPerLine('Turbo Mode: Enabled', 'Modo Turbo: Enabled (Ativado)').ok).toBe(true);
  });

  it('regression: an untagged fence line losing its indentation fails the file checker', () => {
    const { blocks } = protectCode('```\n  port: 80\n```');
    const { blocks: targetBlocks } = protectCode('```\nport: 80\n```');
    const result = compareBlocks(blocks, targetBlocks);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('leading indentation changed');
  });
});
