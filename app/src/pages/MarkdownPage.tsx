import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getMarkdownContent, normalizeDocLang, type DocLang } from '@/lib/markdown';
import { resolveDocLink } from '@/lib/docLinks';
import { rehypeHeadingIds, slugifyHeadings } from '@/lib/headingIds';
import { Loader2, AlertCircle } from 'lucide-react';

type MarkdownState =
  | { status: 'idle' | 'loading' }
  | { status: 'success'; content: string; lang: DocLang; headingSlugs?: string[] }
  | { status: 'error'; message: string };

type MarkdownAction =
  | { type: 'load' }
  | { type: 'success'; content: string; lang: DocLang; headingSlugs?: string[] }
  | { type: 'error'; message: string };

const markdownReducer = (_state: MarkdownState, action: MarkdownAction): MarkdownState => {
  switch (action.type) {
    case 'load':
      return { status: 'loading' };
    case 'success':
      return { status: 'success', content: action.content, lang: action.lang, headingSlugs: action.headingSlugs };
    case 'error':
      return { status: 'error', message: action.message };
    default:
      return { status: 'idle' };
  }
};

export default function MarkdownPage() {
  const { '*': splat } = useParams() as { '*': string };
  const { t, i18n } = useTranslation();
  const lang = normalizeDocLang(i18n.resolvedLanguage);
  const [state, dispatch] = useReducer(markdownReducer, { status: 'loading' } as MarkdownState);
  const { hash } = useLocation();

  useEffect(() => {
    dispatch({ type: 'load' });

    if (!splat) {
      dispatch({ type: 'error', message: t('docs.noDocument') });
      return;
    }

    let active = true;

    // The English body supplies heading slugs so translated headings keep the English anchors
    Promise.all([getMarkdownContent(splat, lang), lang === 'en' ? null : getMarkdownContent(splat, 'en')])
      .then(([{ content, lang: servedLang }, english]) => {
        if (!active) return;
        const headingSlugs = servedLang !== 'en' && english ? slugifyHeadings(english.content) : undefined;
        dispatch({ type: 'success', content, lang: servedLang, headingSlugs });
      })
      .catch(err => {
        console.error('Failed to load markdown:', err);
        if (!active) return;
        dispatch({ type: 'error', message: t('docs.notFoundMessage', { path: splat }) });
      });

    return () => {
      active = false;
    };
  }, [splat, lang, t]);

  // After the content renders (or the hash changes), scroll to the heading named by the fragment
  useEffect(() => {
    if (state.status !== 'success' || !hash) return;
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // Malformed escape: use the raw fragment
    }
    // Headings carry scroll-mt-24 so the sticky docs header does not cover them
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, [state, hash]);

  // Show the notice when the requested language was not served (no translation, or it failed to load)
  const showFallbackNotice = state.status === 'success' && state.lang !== lang;

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t('docs.loading')}</span>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">{t('docs.notFoundTitle')}</h2>
          <p className="text-muted-foreground">{state.message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('docs.checkUrl')}
          </p>
        </div>
      </div>
    );
  }

  if (!state.content) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">{t('docs.emptyTitle')}</h2>
          <p className="text-muted-foreground">{t('docs.emptyMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-8 max-w-4xl mx-auto">
        {showFallbackNotice && (
          <p role="status" className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
            {t('docs.translationUnavailable')}
          </p>
        )}
        <article
          className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
            prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-blue-900
            prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-blue-800
            prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-blue-700
            prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-4
            prose-li:text-gray-700 prose-li:leading-6
            prose-ul:my-4 prose-ol:my-4 prose-li:my-1
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-600 prose-em:italic
            prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:text-sm
            prose-hr:border-gray-300 prose-hr:my-8"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, [rehypeHeadingIds, state.headingSlugs]]}
            components={{
              // Custom heading components with anchor links
              h1: ({ children, ...props }) => (
              <h1 className="scroll-mt-24 text-4xl font-bold text-gray-900 mb-8 mt-0 border-b border-gray-200 pb-4 tracking-tight" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="scroll-mt-24 text-2xl font-bold text-blue-900 mb-6 mt-10 tracking-tight" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="scroll-mt-24 text-xl font-bold text-blue-800 mb-4 mt-8 tracking-tight" {...props}>
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 className="scroll-mt-24 text-lg font-bold text-blue-700 mb-3 mt-6 tracking-tight" {...props}>
                {children}
              </h4>
            ),
            // Custom paragraph styling
            p: ({ children, ...props }) => (
              <p className="text-gray-700 leading-7 mb-4" {...props}>
                {children}
              </p>
            ),
            // Enhanced link handling
            a: ({ href, children, ...props }) => {
              // Relative links point at other docs: resolve them against this doc's directory
              const resolved = resolveDocLink(href, splat ?? '');
              // Same-page anchor: router link so the hash change is handled in-app, without a reload
              if (href?.startsWith('#')) {
                return (
                  <Link
                    to={{ hash: href }}
                    className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors font-medium"
                  >
                    {children}
                  </Link>
                );
              }
              if (resolved?.kind === 'doc' || resolved?.kind === 'route') {
                return (
                  <Link
                    to={resolved.to}
                    className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors font-medium"
                  >
                    {children}
                  </Link>
                );
              }
              if (href?.startsWith('http')) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors font-medium"
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
              return (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors font-medium"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            // Enhanced table styling
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto my-8 shadow-sm border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200" {...props}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead className="bg-gray-50" {...props}>
                {children}
              </thead>
            ),
            tbody: ({ children, ...props }) => (
              <tbody className="bg-white divide-y divide-gray-200" {...props}>
                {children}
              </tbody>
            ),
            th: ({ children, ...props }) => (
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props}>
                {children}
              </td>
            ),
            // Enhanced blockquote styling
            blockquote: ({ children, ...props }) => (
              <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 py-4 my-6 italic text-blue-900 rounded-r-lg" {...props}>
                {children}
              </blockquote>
            ),
            // Enhanced code block styling
            pre: ({ children, ...props }) => (
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto text-sm leading-6 my-6 shadow-inner" {...props}>
                {children}
              </pre>
            ),
            // Enhanced inline code styling
            code: ({ children, className, ...props }) => {
              // Check if this is inline code (not in a pre block)
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="text-pink-600 bg-pink-50 px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              }
              // This is a code block, return as-is
              return <code className={className} {...props}>{children}</code>;
            },
            // Enhanced list styling
            ul: ({ children, ...props }) => (
              <ul className="list-disc list-outside ml-6 my-4 space-y-2" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="list-decimal list-outside ml-6 my-4 space-y-2" {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="text-gray-700 leading-6 pl-1" {...props}>
                {children}
              </li>
            ),
            // Horizontal rule styling
            hr: ({ ...props }) => (
              <hr className="border-gray-300 my-8 border-t-2" {...props} />
            ),
            // Enhanced emphasis styling
            strong: ({ children, ...props }) => (
              <strong className="font-semibold text-gray-900" {...props}>
                {children}
              </strong>
            ),
            em: ({ children, ...props }) => (
              <em className="italic text-gray-600" {...props}>
                {children}
              </em>
            )
            }}
          >
            {state.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
