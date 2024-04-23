import { Metadata } from 'next';
import { mediator } from 'mediateur';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';
import {
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresPageProps,
} from '@/components/pages/garanties-financières/détails/DétailsGarantiesFinancières.page';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import { tryToGetResource } from '@/utils/tryToGetRessource';

export const metadata: Metadata = {
  title: 'Détail des garanties financières - Potentiel',
  description: 'Page de détails des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet },
      });

      const projet = { ...candidature, identifiantProjet };

      const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
        appelOffre: candidature.appelOffre,
        famille: candidature.famille,
        periode: candidature.période,
      });

      if (!soumisAuxGarantiesFinancières) {
        return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
      }

      /**
       * @todo à refacto suite à l'introduction d'une réponse de la query en utilisant @potentiel/monads
       */

      const garantiesFinancières = await tryToGetResource(
        async () =>
          await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
            data: { identifiantProjetValue: identifiantProjet },
          }),
      );

      const props = mapToProps({
        projet,
        utilisateur,
        garantiesFinancières,
      });

      return <DétailsGarantiesFinancièresPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  projet: ConsulterCandidatureReadModel & { identifiantProjet: string };
  utilisateur: Utilisateur.ValueType;
  garantiesFinancières: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel | null;
}) => DétailsGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({ projet, utilisateur, garantiesFinancières }) => {
  if (
    !garantiesFinancières ||
    (!garantiesFinancières.actuelles &&
      !garantiesFinancières.dépôts.find((dépôt) => dépôt.statut.estEnCours()))
  ) {
    return {
      projet,
      action: utilisateur.role.estÉgaleÀ(Role.porteur)
        ? 'soumettre'
        : utilisateur.role.estÉgaleÀ(Role.admin) ||
          utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
          utilisateur.role.estÉgaleÀ(Role.dreal) ||
          utilisateur.role.estÉgaleÀ(Role.cre) ||
          utilisateur.role.estÉgaleÀ(Role.acheteurObligé)
        ? 'enregistrer'
        : undefined,
      historiqueDépôts:
        garantiesFinancières?.dépôts.map((dépôt) => ({
          type: getGarantiesFinancièresTypeLabel(dépôt.type.type),
          dateÉchéance: dépôt.dateÉchéance?.formatter(),
          dateConstitution: dépôt.dateConstitution.formatter(),
          soumisLe: dépôt.soumisLe.formatter(),
          statut: dépôt.statut.statut,
          dernièreMiseÀJour: {
            date: dépôt.dernièreMiseÀJour.date.formatter(),
            par: dépôt.dernièreMiseÀJour.par.formatter(),
          },
          attestation: dépôt.attestation.formatter(),
        })) ?? [],
    };
  }

  const dépôtEnCours = garantiesFinancières.dépôts.find((dépôt) => dépôt.statut.estEnCours());

  return {
    projet,
    actuelles: garantiesFinancières.actuelles
      ? {
          type: getGarantiesFinancièresTypeLabel(garantiesFinancières.actuelles.type.type),
          dateÉchéance: garantiesFinancières.actuelles.dateÉchéance?.formatter(),
          dateConstitution: garantiesFinancières.actuelles.dateConstitution?.formatter(),
          soumisLe: garantiesFinancières.actuelles.soumisLe?.formatter(),
          validéLe: garantiesFinancières.actuelles.validéLe?.formatter(),
          attestation: garantiesFinancières.actuelles.attestation?.formatter(),
          dernièreMiseÀJour: {
            date: garantiesFinancières.actuelles.dernièreMiseÀJour.date.formatter(),
            par: garantiesFinancières.actuelles.dernièreMiseÀJour.par?.formatter(),
          },
          action:
            utilisateur.role.estÉgaleÀ(Role.porteur) &&
            (!garantiesFinancières.actuelles.attestation ||
              !garantiesFinancières.actuelles.dateConstitution)
              ? 'enregister-attestation'
              : utilisateur.role.estÉgaleÀ(Role.dreal) ||
                utilisateur.role.estÉgaleÀ(Role.admin) ||
                utilisateur.role.estÉgaleÀ(Role.dgecValidateur)
              ? 'modifier'
              : undefined,
        }
      : undefined,
    dépôtEnCours: dépôtEnCours
      ? {
          type: getGarantiesFinancièresTypeLabel(dépôtEnCours.type.type),
          dateÉchéance: dépôtEnCours.dateÉchéance?.formatter(),
          dateConstitution: dépôtEnCours.dateConstitution.formatter(),
          soumisLe: dépôtEnCours.soumisLe.formatter(),
          statut: dépôtEnCours.statut.statut,
          dernièreMiseÀJour: {
            date: dépôtEnCours.dernièreMiseÀJour.date.formatter(),
            par: dépôtEnCours.dernièreMiseÀJour.par.formatter(),
          },
          attestation: dépôtEnCours.attestation.formatter(),
          action:
            utilisateur.role.estÉgaleÀ(Role.porteur) || utilisateur.role.estÉgaleÀ(Role.admin)
              ? 'modifier'
              : utilisateur.role.estÉgaleÀ(Role.dreal)
              ? 'instruire'
              : undefined,
        }
      : undefined,
    historiqueDépôts: garantiesFinancières.dépôts
      .filter((dépôt) => !dépôt.statut.estEnCours())
      .map((dépôt) => ({
        type: getGarantiesFinancièresTypeLabel(dépôt.type.type),
        dateÉchéance: dépôt.dateÉchéance?.formatter(),
        dateConstitution: dépôt.dateConstitution.formatter(),
        soumisLe: dépôt.soumisLe.formatter(),
        statut: dépôt.statut.statut,
        dernièreMiseÀJour: {
          date: dépôt.dernièreMiseÀJour.date.formatter(),
          par: dépôt.dernièreMiseÀJour.par.formatter(),
        },
        attestation: dépôt.attestation.formatter(),
      })),
    action: utilisateur.role.estÉgaleÀ(Role.porteur) && !dépôtEnCours ? 'soumettre' : undefined,
  };
};
