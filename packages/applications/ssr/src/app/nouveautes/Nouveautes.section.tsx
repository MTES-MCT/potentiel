import Card, { type CardProps } from '@codegouvfr/react-dsfr/Card';
import Notification from '@codegouvfr/react-dsfr/picto/Notification';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';

const sectionTitle = 'Nouveautés';

type NouveautésSectionProps = {
  nouveautes: Array<{
    title: string;
    content?: string;
    link?: {
      href: string;
      type: 'title' | 'enlarge';
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
        <div className="flex gap-2">
          {nouveautes.length === 0 ? (
            <div>Aucune nouveauté à afficher</div>
          ) : (
            nouveautes.map((n) => {
              const cardProps: CardProps = {
                background: true,
                border: true,
                title: n.title,
                desc: n.content ?? '',
                size: 'small',
                ...(n.link?.type === 'enlarge'
                  ? { enlargeLink: true, linkProps: { href: n.link.href } }
                  : { linkProps: n.link ? { href: n.link.href } : undefined }),
              };

              return <Card {...cardProps} key={n.title} titleAs="h3" />;
            })
          )}
        </div>
      </Section>
    ),
    sectionTitle,
  );
