import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { showMainlevéeGarantiesFinancières } from '@potentiel-applications/feature-flags';

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
import { GarantiesFinancièresDépôtEnCoursProps } from '@/components/pages/garanties-financières/détails/components/GarantiesFinancièresDépôtEnCours';
import { GarantiesFinancièresActuellesProps } from '@/components/pages/garanties-financières/détails/components/GarantiesFinancièresActuelles';

import { MainlevéeProps } from '../../../../components/pages/garanties-financières/détails/components/Mainlevée';

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

      const garantiesFinancièresActuelles =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const dépôtEnCoursGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const achèvement = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: { identifiantProjetValue: identifiantProjet },
      });

      const mainlevée =
        await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
            data: { identifiantProjetValue: identifiantProjet },
          },
        );

      const props = mapToProps({
        projet,
        utilisateur,
        garantiesFinancièresActuelles,
        dépôtEnCoursGarantiesFinancières,
        achèvement,
        mainlevée,
      });

      return <DétailsGarantiesFinancièresPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  projet: ConsulterCandidatureReadModel & { identifiantProjet: string };
  utilisateur: Utilisateur.ValueType;
  garantiesFinancièresActuelles: Option.Type<GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
  dépôtEnCoursGarantiesFinancières: Option.Type<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresReadModel>;
  achèvement: Option.Type<Achèvement.ConsulterAttestationConformitéReadModel>;
  mainlevée: Option.Type<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresReadModel>;
}) => DétailsGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({
  projet,
  utilisateur,
  garantiesFinancièresActuelles,
  dépôtEnCoursGarantiesFinancières,
  achèvement,
  mainlevée,
}) => {
  if (
    Option.isNone(garantiesFinancièresActuelles) &&
    Option.isNone(dépôtEnCoursGarantiesFinancières)
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
      afficherInfoConditionsMainlevée:
        utilisateur.role.estÉgaleÀ(Role.porteur) &&
        Option.isNone(mainlevée) &&
        showMainlevéeGarantiesFinancières,
    };
  }

  const dépôtEnCoursActions: GarantiesFinancièresDépôtEnCoursProps['dépôt']['actions'] = [];
  if (utilisateur.role.estÉgaleÀ(Role.admin)) {
    dépôtEnCoursActions.push('modifier');
  } else if (utilisateur.role.estÉgaleÀ(Role.dreal)) {
    dépôtEnCoursActions.push('instruire', 'modifier');
  } else if (utilisateur.role.estÉgaleÀ(Role.porteur)) {
    dépôtEnCoursActions.push('modifier', 'supprimer');
  }

  const garantiesFinancièresActuellesActions: GarantiesFinancièresActuellesProps['actuelles']['actions'] =
    [];
  const mainlevéeActions: MainlevéeProps['mainlevée']['actions'] = [];

  const estAdminOuDGEC =
    utilisateur.role.estÉgaleÀ(Role.admin) || utilisateur.role.estÉgaleÀ(Role.dgecValidateur);
  const estDreal = utilisateur.role.estÉgaleÀ(Role.dreal);
  const estPorteur = utilisateur.role.estÉgaleÀ(Role.porteur);
  const aGarantiesFinancièresSansAttestation =
    Option.isSome(garantiesFinancièresActuelles) &&
    !garantiesFinancièresActuelles.garantiesFinancières.attestation;
  const aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée =
    Option.isSome(garantiesFinancièresActuelles) &&
    garantiesFinancièresActuelles.garantiesFinancières.attestation &&
    Option.isNone(dépôtEnCoursGarantiesFinancières) &&
    Option.isNone(mainlevée);
  const projetAbandonne = projet.statut === 'abandonné';
  const projetAcheve = Option.isSome(achèvement);
  const mainlevéeDemandée = Option.isSome(mainlevée) && mainlevée.statut.estDemandé();
  const mainlevéeEnInstruction = Option.isSome(mainlevée) && mainlevée.statut.estEnInstruction();

  if (estAdminOuDGEC || estDreal) {
    garantiesFinancièresActuellesActions.push('modifier');
  } else if (estPorteur) {
    if (aGarantiesFinancièresSansAttestation) {
      garantiesFinancièresActuellesActions.push('enregister-attestation');
    } else if (
      aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée &&
      projetAbandonne &&
      showMainlevéeGarantiesFinancières
    ) {
      garantiesFinancièresActuellesActions.push('demander-mainlevée-gf-pour-projet-abandonné');
    } else if (
      aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée &&
      projetAcheve &&
      showMainlevéeGarantiesFinancières
    ) {
      garantiesFinancièresActuellesActions.push('demander-mainlevée-gf-pour-projet-achevé');
    } else if (mainlevéeDemandée) {
      mainlevéeActions.push('annuler-demande-mainlevée-gf');
    }
  }

  if (estDreal) {
    if (mainlevéeDemandée) {
      mainlevéeActions.push('instruire-demande-mainlevée-gf');
    } else if (mainlevéeEnInstruction) {
      mainlevéeActions.push('accepter-demande-mainlevée-gf');
      mainlevéeActions.push('rejeter-demande-mainlevée-gf');
    }
  }

  return {
    projet,
    actuelles: Option.isSome(garantiesFinancièresActuelles)
      ? {
          type: getGarantiesFinancièresTypeLabel(
            garantiesFinancièresActuelles.garantiesFinancières.type.type,
          ),
          dateÉchéance:
            garantiesFinancièresActuelles.garantiesFinancières.dateÉchéance?.formatter(),
          dateConstitution:
            garantiesFinancièresActuelles.garantiesFinancières.dateConstitution?.formatter(),
          soumisLe: garantiesFinancièresActuelles.garantiesFinancières.soumisLe?.formatter(),
          validéLe: garantiesFinancièresActuelles.garantiesFinancières.validéLe?.formatter(),
          attestation: garantiesFinancièresActuelles.garantiesFinancières.attestation?.formatter(),
          dernièreMiseÀJour: {
            date: garantiesFinancièresActuelles.garantiesFinancières.dernièreMiseÀJour.date.formatter(),
            par: garantiesFinancièresActuelles.garantiesFinancières.dernièreMiseÀJour.par?.formatter(),
          },
          actions: garantiesFinancièresActuellesActions,
        }
      : undefined,
    dépôtEnCours: Option.isSome(dépôtEnCoursGarantiesFinancières)
      ? {
          type: getGarantiesFinancièresTypeLabel(dépôtEnCoursGarantiesFinancières.dépôt.type.type),
          dateÉchéance: dépôtEnCoursGarantiesFinancières.dépôt.dateÉchéance?.formatter(),
          dateConstitution: dépôtEnCoursGarantiesFinancières.dépôt.dateConstitution.formatter(),
          soumisLe: dépôtEnCoursGarantiesFinancières.dépôt.soumisLe.formatter(),
          dernièreMiseÀJour: {
            date: dépôtEnCoursGarantiesFinancières.dépôt.dernièreMiseÀJour.date.formatter(),
            par: dépôtEnCoursGarantiesFinancières.dépôt.dernièreMiseÀJour.par.formatter(),
          },
          attestation: dépôtEnCoursGarantiesFinancières.dépôt.attestation.formatter(),
          actions: dépôtEnCoursActions,
        }
      : undefined,
    action:
      Option.isNone(dépôtEnCoursGarantiesFinancières) &&
      utilisateur.role.estÉgaleÀ(Role.porteur) &&
      (Option.isNone(mainlevée) || (Option.isSome(mainlevée) && !mainlevée.statut.estDemandé()))
        ? 'soumettre'
        : undefined,
    mainlevée: Option.isSome(mainlevée)
      ? {
          motif: mainlevée.motif.motif,
          statut: mainlevée.statut.statut,
          demandéLe: mainlevée.demande.demandéeLe.formatter(),
          instructionDémarréeLe: mainlevée.instruction?.démarréeLe.formatter(),
          actions: mainlevéeActions,
        }
      : undefined,
    afficherInfoConditionsMainlevée:
      utilisateur.role.estÉgaleÀ(Role.porteur) &&
      Option.isNone(mainlevée) &&
      showMainlevéeGarantiesFinancières,
  };
};
