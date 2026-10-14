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
      nouveautés.map((n) => (
        <Card
          background
          border
          title={n.title}
          key={n.title}
          desc={n.content}
          detail={n.date ? <FormattedDate date={n.date} /> : undefined}
          titleAs="h3"
          size="small"
          linkProps={
            n.link
              ? {
                  href: n.link.href,
                  title: n.title,
                  ...(n.link.external && {
                    target: '_blank',
                    title: `Ouvrir le lien dans un nouvel onglet`,
                  }),
                }
              : undefined
          }
        />
      ))
    )}
  </div>
);
