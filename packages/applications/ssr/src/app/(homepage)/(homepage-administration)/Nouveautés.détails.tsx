import Card from '@codegouvfr/react-dsfr/Card';

import type { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';

export type NouveautésDétailsProps = {
  nouveautés: Array<{
    title: string;
    content?: string;
    date?: DateTime.RawType;
    link?: {
      href: string;
      external: boolean;
    };
  }>;
};

export const NouveautésDétails = ({ nouveautés }: NouveautésDétailsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    {nouveautés.length === 0 ? (
      <div>Aucune nouveauté à afficher</div>
    ) : (
      nouveautés.map((n) => {
        return (
          <Card
            background
            border
            title={n.title}
            key={n.title}
            desc={n.content ?? undefined}
            detail={n.date ? <FormattedDate date={n.date} /> : undefined}
            titleAs="h3"
            size="small"
            {...(n.link
              ? {
                  enlargeLink: true as const,
                  linkProps: {
                    href: n.link.href,
                    ...(n.link.external && {
                      target: '_blank',
                      'aria-label': `${n.title} dans un nouvel onglet`,
                    }),
                  },
                }
              : { enlargeLink: false as const })}
          />
        );
      })
    )}
  </div>
);
