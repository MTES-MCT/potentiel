import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Accès, Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

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

      const { statut } = await récupérerLauréat(identifiantProjet.formatter());

      const { appelOffres } = await getPériodeAppelOffres(identifiantProjet.formatter());
      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const actuelles = await récuperérerGarantiesFinancièresActuelles(
        identifiantProjet.formatter(),
      );

      const peutAccéderAuxArchivesDesGfs = utilisateur.rôle.aLaPermission(
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

      const mainlevée =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterMainlevéeEnCours',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const accès = utilisateur.rôle.aLaPermission('accès.consulter')
        ? await mediator.send<Accès.ConsulterAccèsQuery>({
            type: 'Projet.Accès.Query.ConsulterAccès',
            data: { identifiantProjet: identifiantProjet.formatter() },
          })
        : Option.none;

      const data = {
        statut,
        actuelles,
        dépôtEnCours,
        mainlevée,
        utilisateur,
        accès,
        appelOffres,
        archivesGarantiesFinancières,
      };
      const { actions } = mapToActionsAndAlertes(data);

      return (
        <DétailsGarantiesFinancièresPage
          identifiantProjet={identifiantProjet.formatter()}
          actuelles={mapToPlainObject(actuelles)}
          archivesGarantiesFinancières={mapToPlainObject(archivesGarantiesFinancières)}
          actions={actions}
        />
      );
    }),
  );
}

type MapToActionsAndAlertesProps = {
  actuelles: Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
  dépôtEnCours: Option.Type<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
  mainlevée: Option.Type<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>;
  utilisateur: Utilisateur.ValueType;
};

const mapToActionsAndAlertes = ({
  utilisateur,
  actuelles,
  dépôtEnCours,
  mainlevée,
}: MapToActionsAndAlertesProps): Pick<DétailsGarantiesFinancièresPageProps, 'actions'> => {
  const actions: ActionGarantiesFinancières[] = [];

  if (Option.isSome(mainlevée)) {
    return { actions: ['garantiesFinancières.mainlevée.consulter'] };
  }

  if (Option.isSome(actuelles) && actuelles.garantiesFinancières.estExemption()) {
    return { actions: [] };
  }

  if (Option.isNone(actuelles)) {
    actions.push('garantiesFinancières.actuelles.enregistrer');
  } else {
    const estConstitué = actuelles.garantiesFinancières.estConstitué();

    actions.push('garantiesFinancières.actuelles.modifier');
    if (!estConstitué) {
      actions.push('garantiesFinancières.actuelles.enregistrerAttestation');
    }

    if (!actuelles.statut.estÉchu()) {
      actions.push('garantiesFinancières.mainlevée.demander');
    }
  }

  if (Option.isNone(dépôtEnCours)) {
    actions.push('garantiesFinancières.dépôt.soumettre');
  } else {
    actions.push('garantiesFinancières.dépôt.consulter');
  }

  return { actions: actions.filter((action) => utilisateur.rôle.aLaPermission(action)) };
};
