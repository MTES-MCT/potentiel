import Notification from '@codegouvfr/react-dsfr/picto/Notification';
import { mediator } from 'mediateur';

import type { Nouveautés } from '@potentiel-domain/nouveautes';
import type { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { NouveautésDétails, type NouveautésDétailsProps } from './Nouveautés.détails';
import { estUneCléDeRouteNouveauté, routesNouveautés } from './routesNouveautés';

const sectionTitle = 'Nouveautés';

export const NouveautésSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const nouveautés = await getNouveautés({ rôle: utilisateur.rôle });

      return (
        <Section
          title={sectionTitle}
          picto={<Notification color="green-emeraude" fontSize="large" />}
          className="border-none"
        >
          <NouveautésDétails nouveautés={nouveautés.map(mapToNouveautéSectionProps)} />
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
      data: { rôle: rôle.nom, limite: 2 },
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
}: Nouveautés.NouveautéReadModel): NouveautésDétailsProps['nouveautés'][number] => ({
  title: titre,
  content: description,
  date: date?.formatter(),
  link: lien ? getLink(lien) : undefined,
});

type GetLinkProps = Nouveautés.LienNouveauté;

const getLink = (lien: GetLinkProps): NouveautésDétailsProps['nouveautés'][number]['link'] => {
  if (lien.type === 'externe') {
    return { href: lien.url, external: true };
  }

  if (estUneCléDeRouteNouveauté(lien.route)) {
    return { href: routesNouveautés[lien.route], external: false };
  }

  getLogger('getLink').warn('Route interne de nouveauté inconnue', { route: lien.route });
  return undefined;
};
