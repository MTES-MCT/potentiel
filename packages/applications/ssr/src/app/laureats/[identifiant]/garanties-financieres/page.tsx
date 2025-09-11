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
import { vérifierProjetNonExemptDeGarantiesFinancières } from './_helpers/vérifierProjetNonExemptDeGarantiesFinancières';
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
      await vérifierProjetNonExemptDeGarantiesFinancières(identifiantProjet);

      const garantiesFinancièresActuelles =
        await récuperérerGarantiesFinancièresActuelles(identifiantProjet);

      // const peutAccéderAuxArchivesDesGfs = utilisateur.role.aLaPermission(
      //   'garantiesFinancières.archives.consulter',
      // );

      // // les archives ne sont visibles que pour les DREAL et DGEC
      // // on limite donc la query à ces utilisateurs pour gagner en perf
      // const archivesGarantiesFinancières = peutAccéderAuxArchivesDesGfs
      //   ? await mediator.send<Lauréat.GarantiesFinancières.ConsulterArchivesGarantiesFinancièresQuery>(
      //       {
      //         type: 'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
      //         data: { identifiantProjetValue: identifiantProjet.formatter() },
      //       },
      //     )
      //   : Option.none;

      const dépôtEnCoursGarantiesFinancières =
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

      const accèsProjet = await mediator.send<Accès.ConsulterAccèsQuery>({
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
        actuelles: garantiesFinancièresActuelles,
        dépôtEnCours: dépôtEnCoursGarantiesFinancières,
        mainlevée,
        utilisateur,
        accès: accèsProjet,
        appelOffres,
      };
      const { infos, actions } = mapToActionsAndInfos(data);
      const props = mapToProps(data);

      return (
        <DétailsGarantiesFinancièresPage
          identifiantProjet={identifiantProjet.formatter()}
          contactPorteurs={props.contactPorteurs}
          actuelles={props.actuelles}
          dépôtEnCours={props.dépôtEnCours}
          // archivesGarantiesFinancières={props.archivesGarantiesFinancières}
          mainlevée={props.mainlevée}
          // historiqueMainlevée={mapToPlainObject(historiqueMainlevée)}
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
      if (!actuelles.attestation) {
        actions.push('garantiesFinancières.actuelles.enregistrerAttestation');
      }

      if (actuelles.statut.estÉchu()) {
        if (utilisateur.role.estDreal()) {
          infos.push('échues');
        }
      } else if (Option.isNone(mainlevée)) {
        if (estAchevéOuAbandonné && !aUnDépôtEnCours && !!actuelles.attestation) {
          actions.push('garantiesFinancières.mainlevée.demander');
        } else if (utilisateur.role.aLaPermission('garantiesFinancières.mainlevée.demander')) {
          infos.push('conditions-demande-mainlevée');
        }
        if (!estAbandonné) {
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
    } else if (Option.isNone(mainlevée)) {
      actions.push('garantiesFinancières.dépôt.soumettre');
    }
  }

  // TODO ETQ dreal si historique mainlevée rejetée modifier-courrier-réponse-mainlevée-gf

  return { actions: actions.filter((action) => utilisateur.role.aLaPermission(action)), infos };
};

const mapToProps = ({
  actuelles,
  dépôtEnCours,
  mainlevée,
  achèvement,
  accès,
  appelOffres,
}: Props) => {
  return {
    actuelles: mapToPlainObject(actuelles),
    dépôtEnCours: mapToPlainObject(dépôtEnCours),
    mainlevée: mapToPlainObject(mainlevée),
    motifMainlevée: Option.isSome(achèvement)
      ? Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.projetAchevé
      : Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.projetAbandonné,
    contactPorteurs: Option.match(accès)
      .some(({ utilisateursAyantAccès }) => utilisateursAyantAccès.map((porteur) => porteur.email))
      .none(() => []),
    appelOffres: mapToPlainObject(appelOffres),
  } satisfies Partial<DétailsGarantiesFinancièresPageProps>;
};
