import Notification from '@codegouvfr/react-dsfr/picto/Notification';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Nouveautés } from '@potentiel-domain/nouveautes';
import type { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { NouveautésDétails, type NouveautésDétailsProps } from './Nouveautés.détails';

const sectionTitle = 'Nouveautés';

export const NouveautésSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      if (!utilisateur.estAdministration() && !utilisateur.rôle.estAdmin()) {
        return notFound();
      }

      const nouveautes = await getNouveautés({ rôle: utilisateur.rôle });

      return (
        <Section
          title={sectionTitle}
          picto={<Notification color="green-emeraude" fontSize="large" />}
          className="border-none"
        >
          <NouveautésDétails nouveautes={nouveautes.map(mapToNouveautéSectionProps)} />
        </Section>
      );
    }),
    sectionTitle,
  );

type GetNouveautésProps = {
  rôle: Role.ValueType;
};

const getNouveautés = async ({
  rôle,
}: GetNouveautésProps): Promise<Nouveautés.ListerNouveautésReadModel['items']> => {
  try {
    const { items } = await mediator.send<Nouveautés.ListerNouveautésQuery>({
      type: 'Nouveautés.Query.ListerNouveautés',
      data: { rôle: rôle.nom },
    });
    return items;
  } catch (error) {
    getLogger('getNouveautés').error(error as Error);
    return [];
  }
};

const mapToNouveautéSectionProps = ({
  titre,
  description,
  date,
  lien,
}: Nouveautés.NouveautéReadModel): NouveautésDétailsProps['nouveautes'][number] => ({
  title: titre,
  content: description,
  date: date?.formatter(),
  link: lien ? { href: lien.url, external: lien.type === 'externe' } : undefined,
});
