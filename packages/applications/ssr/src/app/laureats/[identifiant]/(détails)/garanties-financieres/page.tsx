import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getGarantiesFinancières } from '../../_helpers';
import { vérifierProjetSoumisAuxGarantiesFinancières } from './_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import {
  DétailsGarantiesFinancièresPage,
  type DétailsGarantiesFinancièresPageProps,
} from './DétailsGarantiesFinancières.page';

export const metadata: Metadata = { title: 'Détail des garanties financières' };

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const peutAccéderAuxArchivesDesGfs = utilisateur.rôle.aLaPermission(
        'garantiesFinancières.archives.lister',
      );

      const archivesGarantiesFinancières = peutAccéderAuxArchivesDesGfs
        ? await mediator.send<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresQuery>(
            {
              type: 'Lauréat.GarantiesFinancières.Query.ListerArchivesGarantiesFinancières',
              data: { identifiantProjetValue: identifiantProjet.formatter() },
            },
          )
        : [];

      const { mainlevée, dépôt, actuelles } = await getGarantiesFinancières(
        identifiantProjet.formatter(),
      );

      const archivesMainlevée =
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            statut: ['rejeté'],
          },
        });

      const actions = mapToActionsAndAlertes({
        actuelles,
        dépôt,
        mainlevée,
        hasArchivesMainlevée: !!archivesMainlevée?.items.length,
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
  actuelles?: Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresActuellesReadModel;
  dépôt?: Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel;
  mainlevée?: Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel;
  hasArchivesMainlevée: boolean;
  utilisateur: Utilisateur.ValueType;
};

const mapToActionsAndAlertes = ({
  utilisateur,
  actuelles,
  dépôt,
  mainlevée,
  hasArchivesMainlevée,
}: MapToActionsAndAlertesProps): DétailsGarantiesFinancièresPageProps['actions'] => {
  const actions: DétailsGarantiesFinancièresPageProps['actions'] = [];

  if (actuelles?.garantiesFinancières.estExemption()) return [];

  if (hasArchivesMainlevée) {
    actions.push('garantiesFinancières.mainlevée.lister');
  }

  if (mainlevée) {
    actions.push('garantiesFinancières.mainlevée.consulter');

    const mainlevéeEnCours = mainlevée.statut.estDemandé() || mainlevée.statut.estEnInstruction();

    if (mainlevéeEnCours) {
      actions.push('garantiesFinancières.actuelles.modifier');
    }

    return actions.filter((action) => utilisateur.rôle.aLaPermission(action));
  }

  if (!actuelles) {
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

  if (dépôt) {
    actions.push('garantiesFinancières.dépôt.consulter');
  } else {
    actions.push('garantiesFinancières.dépôt.soumettre');
  }

  return actions.filter((action) => utilisateur.rôle.aLaPermission(action));
};
