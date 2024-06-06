import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
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
import { GarantiesFinancièresDépôtEnCoursProps } from '@/components/pages/garanties-financières/détails/components/GarantiesFinancièresDépôtEnCours';
import { GarantiesFinancièresActuellesProps } from '@/components/pages/garanties-financières/détails/components/GarantiesFinancièresActuelles';

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

      const mainLevée =
        await mediator.send<GarantiesFinancières.ConsulterMainLevéeGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.MainLevée.Query.Consulter',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const props = mapToProps({
        projet,
        utilisateur,
        garantiesFinancièresActuelles,
        dépôtEnCoursGarantiesFinancières,
        achèvement,
        mainLevée,
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
  mainLevée: Option.Type<GarantiesFinancières.ConsulterMainLevéeGarantiesFinancièresReadModel>;
}) => DétailsGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({
  projet,
  utilisateur,
  garantiesFinancièresActuelles,
  dépôtEnCoursGarantiesFinancières,
  achèvement,
  mainLevée,
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
      afficherInfoConditionsMainLevée:
        utilisateur.role.estÉgaleÀ(Role.porteur) && Option.isNone(mainLevée),
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
  if (utilisateur.role.estÉgaleÀ(Role.admin) || utilisateur.role.estÉgaleÀ(Role.dgecValidateur)) {
    garantiesFinancièresActuellesActions.push('modifier');
  } else if (utilisateur.role.estÉgaleÀ(Role.dreal)) {
    garantiesFinancièresActuellesActions.push('modifier');
  } else if (
    utilisateur.role.estÉgaleÀ(Role.porteur) &&
    Option.isSome(garantiesFinancièresActuelles) &&
    !garantiesFinancièresActuelles.garantiesFinancières.attestation
  ) {
    garantiesFinancièresActuellesActions.push('enregister-attestation');
  } else if (
    utilisateur.role.estÉgaleÀ(Role.porteur) &&
    Option.isSome(garantiesFinancièresActuelles) &&
    garantiesFinancièresActuelles.garantiesFinancières.attestation &&
    Option.isNone(dépôtEnCoursGarantiesFinancières) &&
    Option.isNone(mainLevée)
  ) {
    if (projet.statut === 'abandonné') {
      garantiesFinancièresActuellesActions.push('demander-main-levée-gf-pour-projet-abandonné');
    }
    if (Option.isSome(achèvement)) {
      garantiesFinancièresActuellesActions.push('demander-main-levée-gf-pour-projet-achevé');
    }
  } else if (
    utilisateur.role.estÉgaleÀ(Role.porteur) &&
    Option.isSome(mainLevée) &&
    mainLevée.statut.estDemandé()
  ) {
    garantiesFinancièresActuellesActions.push('annuler-main-levée-gf');
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
      (Option.isNone(mainLevée) || (Option.isSome(mainLevée) && !mainLevée.statut.estDemandé()))
        ? 'soumettre'
        : undefined,
    mainLevée: Option.isSome(mainLevée)
      ? {
          motif: mainLevée.motif.motif,
          statut: mainLevée.statut.statut,
          demandéLe: mainLevée.demande.demandéeLe.formatter(),
        }
      : undefined,
    afficherInfoConditionsMainLevée:
      utilisateur.role.estÉgaleÀ(Role.porteur) && Option.isNone(mainLevée),
  };
};
