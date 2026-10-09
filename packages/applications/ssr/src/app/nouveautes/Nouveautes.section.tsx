import Card, { type CardProps } from '@codegouvfr/react-dsfr/Card';
import Notification from '@codegouvfr/react-dsfr/picto/Notification';

import type { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';

const sectionTitle = 'Nouveautés';

export type NouveautésSectionProps = {
  nouveautes: Array<{
    title: string;
    content?: string;
    date?: DateTime.RawType;
    link?: {
      href: string;
      external: boolean;
    };
  }>;
};

export const NouveautésSection = ({ nouveautes }: NouveautésSectionProps) =>
  SectionWithErrorHandling(
    async () => (
      <Section
        title={sectionTitle}
        picto={<Notification color="green-emeraude" fontSize="large" />}
        className="border-none"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {nouveautes.length === 0 ? (
            <div>Aucune nouveauté à afficher</div>
          ) : (
            nouveautes.map((n) => {
              const linkProps = n.link && {
                href: n.link.href,
                title: n.title,
                ...(n.link.external && {
                  target: '_blank',
                  title: `Ouvrir la nouveauté ${n.title} dans un nouvel onglet`,
                }),
              };

              const cardProps: CardProps = {
                background: true,
                border: true,
                title: n.title,
                desc: n.content ?? '',
                detail: n.date ? <FormattedDate date={n.date} /> : undefined,
                size: 'small',
                ...(linkProps && { linkProps }),
              };

              return <Card {...cardProps} key={n.title} titleAs="h3" />;
            })
          )}
        </div>
      </Section>
    ),
    sectionTitle,
  );
