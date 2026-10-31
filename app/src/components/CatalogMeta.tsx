import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Requirements, ResourceLink } from '@/types/questionnaire';
import { hasCatalogMeta, requirementParts, safeHref } from '@/utils/catalogMeta';

interface CatalogMetaProps {
  links?: ResourceLink[];
  requirements?: Requirements;
}

export function CatalogMeta({ links, requirements }: CatalogMetaProps) {
  const { t } = useTranslation();

  if (!hasCatalogMeta({ links, requirements })) return null;

  const parts = requirementParts(requirements, t);
  const validLinks = (links ?? []).flatMap(link => {
    const target = safeHref(link.url);
    return target ? [{ link, target }] : [];
  });
  const linkClass = 'underline underline-offset-2 hover:text-foreground';

  return (
    <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
      {parts.length > 0 && (
        <p>
          {t('questionnaire.questions.results.catalog.requirements')}: {parts.join(' · ')}
        </p>
      )}
      {validLinks.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {validLinks.map(({ link, target }) =>
            target.internal ? (
              <Link key={`${link.kind}-${link.url}`} to={target.href} className={linkClass}>
                {t(`questionnaire.questions.results.catalog.links.${link.kind}`)}
              </Link>
            ) : (
              <a
                key={`${link.kind}-${link.url}`}
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t(`questionnaire.questions.results.catalog.links.${link.kind}`)}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default CatalogMeta;
