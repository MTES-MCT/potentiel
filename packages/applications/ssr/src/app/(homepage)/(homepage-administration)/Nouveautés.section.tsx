import Notification from '@codegouvfr/react-dsfr/picto/Notification';
import { notFound } from 'next/navigation';

import { Role } from '@potentiel-domain/utilisateur';
import { GristApiClient } from '@potentiel-infrastructure/grist-api-client';
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

      const nouveautes = await getNouveautés({ rôle: utilisateur?.rôle ?? Role.visiteur });

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
}: GetNouveautésProps): Promise<Array<GristApiClient.Nouveauté>> => {
  try {
    const nouveautés = await GristApiClient.récupérerNouveautés();
    return nouveautés.filter(({ rôles }) => rôle.estAdmin() || rôles.includes(rôle.nom));
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
}: GristApiClient.Nouveauté): NouveautésDétailsProps['nouveautes'][number] => ({
  title: titre,
  content: description,
  date,
  link: lien ? { href: lien.url, external: lien.type === 'externe' } : undefined,
});
