import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';
import { AppelOffre, ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { récupérerPorteursParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';

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
import { AuthenticatedUserReadModel } from '@/utils/getAuthenticatedUser.handler';
import { MainlevéeEnCoursProps } from '@/components/pages/garanties-financières/détails/components/MainlevéeEnCours';
import { HistoriqueMainlevéeRejetéeProps } from '@/components/pages/garanties-financières/détails/components/HistoriqueMainlevéeRejetée';
import {
  DépôtGarantiesFinancières,
  GarantiesFinancièresActuelles,
} from '@/components/organisms/garantiesFinancières/types';

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

      if (Option.isNone(candidature)) {
        return notFound();
      }

      const appelOffreDetails = await mediator.send<ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: candidature.appelOffre },
      });

      if (Option.isNone(appelOffreDetails)) {
        return notFound();
      }

      const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
        appelOffre: candidature.appelOffre,
        famille: candidature.famille,
        periode: candidature.période,
      });

      if (!soumisAuxGarantiesFinancières) {
        return <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjet} />;
      }

      const garantiesFinancièresActuelles =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const peutAccéderAuxArchivesDesGfs =
        utilisateur.role.estÉgaleÀ(Role.admin) ||
        utilisateur.role.estÉgaleÀ(Role.dreal) ||
        utilisateur.role.estÉgaleÀ(Role.dgecValidateur);

      // les archives ne sont visibles que pour les DREAL et DGEC
      // on limite donc la query à ces utilisateurs pour gagner en perf
      const archivesGarantiesFinancières = peutAccéderAuxArchivesDesGfs
        ? await mediator.send<GarantiesFinancières.ConsulterArchivesGarantiesFinancièresQuery>({
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
            data: { identifiantProjetValue: identifiantProjet },
          })
        : Option.none;

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

      const historiqueMainlevée =
        await mediator.send<GarantiesFinancières.ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
            data: {
              identifiantProjetValue: identifiantProjet,
            },
          },
        );

      const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
      );

      const props = mapToProps({
        identifiantProjet,
        utilisateur,
        garantiesFinancièresActuelles,
        dépôtEnCoursGarantiesFinancières,
        achèvement,
        mainlevée,
        appelOffreDetails,
        historiqueMainlevée,
        statut: candidature.statut,
        contactPorteurs: porteurs.map((porteur) => porteur.email),
        archivesGarantiesFinancières,
      });

      return <DétailsGarantiesFinancièresPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  identifiantProjet: string;
  contactPorteurs: string[];
  utilisateur: AuthenticatedUserReadModel;
  garantiesFinancièresActuelles: Option.Type<GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
  dépôtEnCoursGarantiesFinancières: Option.Type<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresReadModel>;
  achèvement: Option.Type<Achèvement.ConsulterAttestationConformitéReadModel>;
  mainlevée: Option.Type<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresReadModel>;
  appelOffreDetails: AppelOffre;
  historiqueMainlevée: Option.Type<GarantiesFinancières.ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresReadModel>;
  statut: StatutProjet.RawType;
  archivesGarantiesFinancières: Option.Type<GarantiesFinancières.ConsulterArchivesGarantiesFinancièresReadModel>;
}) => DétailsGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({
  identifiantProjet,
  contactPorteurs,
  utilisateur,
  garantiesFinancièresActuelles,
  dépôtEnCoursGarantiesFinancières,
  achèvement,
  mainlevée,
  appelOffreDetails,
  historiqueMainlevée,
  statut,
  archivesGarantiesFinancières,
}) => {
  if (
    Option.isNone(garantiesFinancièresActuelles) &&
    Option.isNone(dépôtEnCoursGarantiesFinancières)
  ) {
    return {
      identifiantProjet,
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
        utilisateur.role.estÉgaleÀ(Role.porteur) && Option.isNone(mainlevée),
    };
  }

  const dépôtEnCoursActions: DépôtGarantiesFinancières['actions'] = [];
  if (utilisateur.role.estÉgaleÀ(Role.admin)) {
    dépôtEnCoursActions.push('modifier');
  } else if (utilisateur.role.estÉgaleÀ(Role.dreal)) {
    dépôtEnCoursActions.push('instruire', 'modifier');
  } else if (utilisateur.role.estÉgaleÀ(Role.porteur)) {
    dépôtEnCoursActions.push('modifier', 'supprimer');
  }

  const garantiesFinancièresActuellesActions: GarantiesFinancièresActuelles['actions'] = [];
  const mainlevéeActions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'] = [];
  const historiqueMainlevéeActions: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée']['actions'] =
    [];

  const estAdminOuDGEC =
    utilisateur.role.estÉgaleÀ(Role.admin) || utilisateur.role.estÉgaleÀ(Role.dgecValidateur);
  const estDreal = utilisateur.role.estÉgaleÀ(Role.dreal);
  const estPorteur = utilisateur.role.estÉgaleÀ(Role.porteur);

  const aGarantiesFinancièresSansAttestation =
    Option.isSome(garantiesFinancièresActuelles) &&
    !garantiesFinancièresActuelles.garantiesFinancières.attestation;
  const aGarantiesFinancièresNonLevées =
    Option.isSome(garantiesFinancièresActuelles) &&
    !garantiesFinancièresActuelles.garantiesFinancières.statut.estLevé();
  const aGarantiesFinancièresÉchues =
    Option.isSome(garantiesFinancièresActuelles) &&
    garantiesFinancièresActuelles.garantiesFinancières.statut.estÉchu();
  const aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée =
    Option.isSome(garantiesFinancièresActuelles) &&
    garantiesFinancièresActuelles.garantiesFinancières.attestation &&
    Option.isNone(dépôtEnCoursGarantiesFinancières) &&
    Option.isNone(mainlevée);
  const projetAbandonne = statut === 'abandonné';
  const projetAcheve = Option.isSome(achèvement);
  const mainlevéeDemandée = Option.isSome(mainlevée) && mainlevée.statut.estDemandé();
  const mainlevéeEnInstruction = Option.isSome(mainlevée) && mainlevée.statut.estEnInstruction();
  const mainlevéeAccordéeOuRefusée =
    (Option.isSome(mainlevée) && mainlevée.statut.estAccordé()) ||
    Option.isSome(historiqueMainlevée);

  if (aGarantiesFinancièresSansAttestation) {
    garantiesFinancièresActuellesActions.push('enregister-attestation');
  }

  if ((estAdminOuDGEC || estDreal) && aGarantiesFinancièresNonLevées) {
    garantiesFinancièresActuellesActions.push('modifier');
  } else if (estPorteur) {
    if (aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée && projetAbandonne) {
      garantiesFinancièresActuellesActions.push('demander-mainlevée-gf-pour-projet-abandonné');
    }
    if (aGarantiesFinancièresAvecAttestationSansDepotNiMainlevée && projetAcheve) {
      garantiesFinancièresActuellesActions.push('demander-mainlevée-gf-pour-projet-achevé');
    }
    if (mainlevéeDemandée) {
      mainlevéeActions.push('annuler-demande-mainlevée-gf');
    }
  }

  if (estDreal) {
    if (aGarantiesFinancièresÉchues) {
      garantiesFinancièresActuellesActions.push('contacter-porteur-pour-gf-échues');
    }
    mainlevéeActions.push('voir-appel-offre-info');
    if (mainlevéeDemandée) {
      mainlevéeActions.push('instruire-demande-mainlevée-gf');
    }
    if (mainlevéeEnInstruction || mainlevéeDemandée) {
      mainlevéeActions.push('accorder-ou-rejeter-demande-mainlevée-gf');
    }
    if (mainlevéeAccordéeOuRefusée) {
      historiqueMainlevéeActions.push('modifier-courrier-réponse-mainlevée-gf');
      mainlevéeActions.push('modifier-courrier-réponse-mainlevée-gf');
    }
  }

  const peutDemanderMainlevée =
    garantiesFinancièresActuellesActions.includes('demander-mainlevée-gf-pour-projet-abandonné') ||
    garantiesFinancièresActuellesActions.includes('demander-mainlevée-gf-pour-projet-achevé');

  return {
    identifiantProjet,
    contactPorteurs,
    actuelles: Option.isSome(garantiesFinancièresActuelles)
      ? {
          ...mapGarantiesFinancièrestoProps({
            garantiesFinancières: garantiesFinancièresActuelles.garantiesFinancières,
          }),
          actions: garantiesFinancièresActuellesActions,
          isActuelle: true,
        }
      : undefined,
    archivesGarantiesFinancières: Option.isSome(archivesGarantiesFinancières)
      ? archivesGarantiesFinancières.archives.map((garantiesFinancières) =>
          mapGarantiesFinancièrestoProps({
            garantiesFinancières,
          }),
        )
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
          isActuelle: false,
        }
      : undefined,
    action:
      Option.isNone(dépôtEnCoursGarantiesFinancières) &&
      utilisateur.role.estÉgaleÀ(Role.porteur) &&
      Option.isNone(mainlevée)
        ? 'soumettre'
        : undefined,
    mainlevée: Option.isSome(mainlevée)
      ? {
          motif: mainlevée.motif.motif,
          statut: mainlevée.statut.statut,
          demandéLe: mainlevée.demande.demandéeLe.formatter(),
          instructionDémarréeLe: mainlevée.instruction?.démarréeLe.formatter(),
          accord: {
            accordéeLe: mainlevée.accord?.accordéeLe.formatter(),
            courrierAccord: mainlevée.accord?.courrierAccord.formatter(),
          },
          dernièreMiseÀJour: {
            date: mainlevée.dernièreMiseÀJour.date.formatter(),
            par: mainlevée.dernièreMiseÀJour.par.formatter(),
          },
          actions: mainlevéeActions,
          urlAppelOffre: appelOffreDetails.cahiersDesChargesUrl,
        }
      : undefined,
    historiqueMainlevée: Option.isSome(historiqueMainlevée)
      ? {
          historique: historiqueMainlevée.historique.map((mainlevée) => ({
            motif: mainlevée.motif.motif,
            demandéeLe: mainlevée.demande.demandéeLe.formatter(),
            rejet: {
              rejetéLe: mainlevée.rejet.rejetéLe.formatter(),
              rejetéPar: mainlevée.rejet.rejetéPar.email,
              courrierRejet: mainlevée.rejet.courrierRejet.formatter(),
            },
          })),
          actions: historiqueMainlevéeActions,
        }
      : undefined,
    afficherInfoConditionsMainlevée:
      utilisateur.role.estÉgaleÀ(Role.porteur) &&
      Option.isNone(mainlevée) &&
      !peutDemanderMainlevée,
  };
};

const mapGarantiesFinancièrestoProps = ({
  garantiesFinancières,
}: {
  garantiesFinancières: GarantiesFinancières.GarantiesFinancièresReadModel;
}) => ({
  type: getGarantiesFinancièresTypeLabel(garantiesFinancières.type.type),
  statut: garantiesFinancières.statut.statut,
  dateÉchéance: garantiesFinancières.dateÉchéance?.formatter(),
  dateConstitution: garantiesFinancières.dateConstitution?.formatter(),
  soumisLe: garantiesFinancières.soumisLe?.formatter(),
  validéLe: garantiesFinancières.validéLe?.formatter(),
  attestation: garantiesFinancières.attestation?.formatter(),
  dernièreMiseÀJour: {
    date: garantiesFinancières.dernièreMiseÀJour.date.formatter(),
    par: garantiesFinancières.dernièreMiseÀJour.par?.formatter(),
  },
});
