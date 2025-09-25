import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Accès, Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerLauréat, getPériodeAppelOffres } from '@/app/_helpers';

import {
  ActionGarantiesFinancières,
  DétailsGarantiesFinancièresPage,
  DétailsGarantiesFinancièresPageProps,
} from './DétailsGarantiesFinancières.page';
import { vérifierProjetSoumisAuxGarantiesFinancières } from './_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { récuperérerGarantiesFinancièresActuelles } from './_helpers/récupérerGarantiesFinancièresActuelles';

export const metadata: Metadata = {
  title: 'Détail des garanties financières - Potentiel',
  description: 'Page de détails des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      await récupérerLauréat(identifiantProjet.formatter());

      const { appelOffres } = await getPériodeAppelOffres(identifiantProjet);
      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const actuelles = await récuperérerGarantiesFinancièresActuelles(identifiantProjet);

      const peutAccéderAuxArchivesDesGfs = utilisateur.role.aLaPermission(
        'garantiesFinancières.archives.lister',
      );

      // les archives ne sont visibles que pour les DREAL et DGEC
      const archivesGarantiesFinancières = peutAccéderAuxArchivesDesGfs
        ? await mediator.send<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresQuery>(
            {
              type: 'Lauréat.GarantiesFinancières.Query.ListerArchivesGarantiesFinancières',
              data: { identifiantProjetValue: identifiantProjet.formatter() },
            },
          )
        : [];

      const dépôtEnCours =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      const achèvement =
        await mediator.send<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéQuery>(
          {
            type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
            data: { identifiantProjetValue: identifiantProjet.formatter() },
          },
        );

      const mainlevée =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });
      const mainlevéesRejetées =
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
          },
        });

      const accès = await mediator.send<Accès.ConsulterAccèsQuery>({
        type: 'Projet.Accès.Query.ConsulterAccès',
        data: { identifiantProjet: identifiantProjet.formatter() },
      });

      const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const data = {
        achèvement,
        abandon,
        actuelles,
        dépôtEnCours,
        mainlevée,
        utilisateur,
        accès,
        appelOffres,
        mainlevéesRejetées,
        archivesGarantiesFinancières,
      };
      const { infos, actions } = mapToActionsAndInfos(data);
      const props = mapToProps(data);

      return (
        <DétailsGarantiesFinancièresPage
          identifiantProjet={identifiantProjet.formatter()}
          contactPorteurs={props.contactPorteurs}
          actuelles={props.actuelles}
          dépôtEnCours={props.dépôtEnCours}
          archivesGarantiesFinancières={props.archivesGarantiesFinancières}
          mainlevée={props.mainlevée}
          mainlevéesRejetées={props.mainlevéesRejetées}
          motifMainlevée={props.motifMainlevée}
          appelOffres={props.appelOffres}
          actions={actions}
          infos={infos}
        />
      );
    }),
  );
}

type Props = {
  achèvement: Option.Type<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéReadModel>;
  abandon: Option.Type<Lauréat.Abandon.ConsulterAbandonReadModel>;
  actuelles: Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
  dépôtEnCours: Option.Type<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
  mainlevée: Option.Type<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>;
  mainlevéesRejetées: Lauréat.GarantiesFinancières.ListerMainlevéesReadModel;
  archivesGarantiesFinancières: Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresReadModel;
  accès: Option.Type<Accès.ConsulterAccèsReadModel>;
  utilisateur: Utilisateur.ValueType;
  appelOffres: AppelOffre.AppelOffreReadModel;
};

const mapToActionsAndInfos = ({
  abandon,
  achèvement,
  utilisateur,
  actuelles,
  dépôtEnCours,
  mainlevéesRejetées,
  mainlevée,
}: Props): Pick<DétailsGarantiesFinancièresPageProps, 'actions' | 'infos'> => {
  const actions: ActionGarantiesFinancières[] = [];
  const infos: DétailsGarantiesFinancièresPageProps['infos'] = [];

  const estAbandonné = Option.match(abandon)
    .some((abandon) => abandon.statut.estAccordé())
    .none(() => false);
  const estAchevé = Option.isSome(achèvement);
  const estAchevéOuAbandonné = estAchevé || estAbandonné;
  const aUnDépôtEnCours = Option.isSome(dépôtEnCours);

  if (Option.isSome(mainlevée)) {
    if (mainlevée.statut.estAccordé() || mainlevée.statut.estRejeté()) {
      actions.push('garantiesFinancières.mainlevée.corrigerRéponseSignée');
    } else {
      if (mainlevée.statut.estDemandé()) {
        actions.push('garantiesFinancières.mainlevée.annuler');
        actions.push('garantiesFinancières.mainlevée.démarrerInstruction');
      }
      actions.push('garantiesFinancières.mainlevée.accorder');
      actions.push('garantiesFinancières.mainlevée.rejeter');

      actions.push('garantiesFinancières.actuelles.modifier');
    }
  } else {
    if (Option.isNone(actuelles)) {
      actions.push('garantiesFinancières.actuelles.enregistrer');
    } else {
      if (!actuelles.garantiesFinancières.estConstitué()) {
        actions.push('garantiesFinancières.actuelles.enregistrerAttestation');
      }

      if (actuelles.statut.estÉchu()) {
        if (utilisateur.role.estDreal()) {
          infos.push('échues');
        }
      } else if (Option.isNone(mainlevée) && !actuelles.garantiesFinancières.estExemption()) {
        if (
          estAchevéOuAbandonné &&
          !aUnDépôtEnCours &&
          actuelles.garantiesFinancières.estConstitué()
        ) {
          actions.push('garantiesFinancières.mainlevée.demander');
        } else if (utilisateur.role.aLaPermission('garantiesFinancières.mainlevée.demander')) {
          infos.push('conditions-demande-mainlevée');
        }
        if (!estAbandonné && actuelles.garantiesFinancières.estConstitué()) {
          actions.push('achèvement.attestationConformité.transmettre');
        }
      }

      actions.push('garantiesFinancières.actuelles.modifier');
    }

    if (Option.isSome(dépôtEnCours)) {
      actions.push('garantiesFinancières.dépôt.modifier');
      actions.push('garantiesFinancières.dépôt.valider');
      actions.push('garantiesFinancières.dépôt.supprimer');
      if (
        dépôtEnCours.garantiesFinancières.estAvecDateÉchéance() &&
        dépôtEnCours.garantiesFinancières.dateÉchéance.estPassée() &&
        !estAchevéOuAbandonné
      ) {
        infos.push('date-échéance-dépôt-passée');
      }
    } else if (
      Option.isNone(mainlevée) &&
      (Option.isNone(actuelles) || !actuelles.garantiesFinancières.estExemption())
    ) {
      actions.push('garantiesFinancières.dépôt.soumettre');
    }
  }

  if (mainlevéesRejetées.total > 0) {
    actions.push('garantiesFinancières.mainlevée.corrigerRéponseSignée');
  }

  // TODO ETQ dreal si historique mainlevée rejetée modifier-courrier-réponse-mainlevée-gf

  return { actions: actions.filter((action) => utilisateur.role.aLaPermission(action)), infos };
};

const mapToProps = ({
  actuelles,
  dépôtEnCours,
  mainlevée,
  mainlevéesRejetées,
  archivesGarantiesFinancières,
  achèvement,
  accès,
  appelOffres,
}: Props) => {
  return {
    actuelles: mapToPlainObject(actuelles),
    dépôtEnCours: mapToPlainObject(dépôtEnCours),
    mainlevée: mapToPlainObject(mainlevée),
    mainlevéesRejetées: mainlevéesRejetées.items.map(mapToPlainObject),
    archivesGarantiesFinancières: archivesGarantiesFinancières.map(mapToPlainObject),
    motifMainlevée: Option.isSome(achèvement)
      ? Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.projetAchevé
      : Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.projetAbandonné,
    contactPorteurs: Option.match(accès)
      .some(({ utilisateursAyantAccès }) => utilisateursAyantAccès.map((porteur) => porteur.email))
      .none(() => []),
    appelOffres: mapToPlainObject(appelOffres),
  } satisfies Partial<DétailsGarantiesFinancièresPageProps>;
};
