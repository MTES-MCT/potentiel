import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

import {
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

      const actions = mapToActionsAndAlertes({
        actuelles,
        dépôtEnCours,
        mainlevée,
        utilisateur,
      });

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
}: MapToActionsAndAlertesProps): DétailsGarantiesFinancièresPageProps['actions'] => {
  const actions: DétailsGarantiesFinancièresPageProps['actions'] = [];

  if (Option.isSome(mainlevée)) {
    return ['garantiesFinancières.mainlevée.consulter'];
  }

  if (Option.isSome(actuelles) && actuelles.garantiesFinancières.estExemption()) {
    return [];
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

  return actions.filter((action) => utilisateur.rôle.aLaPermission(action));
};
