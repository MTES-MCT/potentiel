import {
  GarantiesFinancièreProjector,
  HistoriqueProjector,
} from '@potentiel-applications/projectors';
import { GarantiesFinancièresNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupGarantiesFinancières: SetupProjet = async ({ sendEmail }) => {
  const garantiesFinancières = createSubscriptionSetup('garanties-financieres');
  Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.register();

  GarantiesFinancièreProjector.register();
  await garantiesFinancières.setupSubscription<
    GarantiesFinancièreProjector.SubscriptionEvent,
    GarantiesFinancièreProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'GarantiesFinancièresDemandées-V1',
      'DépôtGarantiesFinancièresSoumis-V1',
      'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
      'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
      'DépôtGarantiesFinancièresEnCoursModifié-V1',
      'DépôtGarantiesFinancièresEnCoursValidé-V1',
      'DépôtGarantiesFinancièresEnCoursValidé-V2',
      'TypeGarantiesFinancièresImporté-V1',
      'GarantiesFinancièresImportées-V1',
      'GarantiesFinancièresModifiées-V1',
      'AttestationGarantiesFinancièresEnregistrée-V1',
      'GarantiesFinancièresEnregistrées-V1',
      'HistoriqueGarantiesFinancièresEffacé-V1',
      'MainlevéeGarantiesFinancièresDemandée-V1',
      'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
      'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
      'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
      'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
      'GarantiesFinancièresÉchues-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat.GarantiesFinancières',
  });

  GarantiesFinancièresNotification.register({ sendEmail });
  await garantiesFinancières.setupSubscription<
    GarantiesFinancièresNotification.SubscriptionEvent,
    GarantiesFinancièresNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'DépôtGarantiesFinancièresSoumis-V1',
      'DépôtGarantiesFinancièresEnCoursValidé-V1',
      'DépôtGarantiesFinancièresEnCoursValidé-V2',
      'AttestationGarantiesFinancièresEnregistrée-V1',
      'GarantiesFinancièresModifiées-V1',
      'GarantiesFinancièresEnregistrées-V1',
      'MainlevéeGarantiesFinancièresDemandée-V1',
      'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
      'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
      'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
      'GarantiesFinancièresÉchues-V1',
    ],
    messageType: 'System.Notification.Lauréat.GarantiesFinancières',
  });

  await garantiesFinancières.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return garantiesFinancières.clearSubscriptions;
};
