import { EventBus } from '@core/domain';
import { logger } from '@core/utils';
import {
  AppelOffreProjetModifié,
  CovidDelayGranted,
  ProjectAbandoned,
  ProjectActionnaireUpdated,
  ProjectCertificateGenerated,
  ProjectCertificateObsolete,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectClasseGranted,
  ProjectCompletionDueDateCancelled,
  ProjectCompletionDueDateSet,
  ProjectDataCorrected,
  ProjectDCRDueDateCancelled,
  ProjectDCRDueDateSet,
  ProjectFournisseursUpdated,
  ProjectImported,
  CahierDesChargesChoisi,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectProducteurUpdated,
  ProjectPuissanceUpdated,
  ProjectReimported,
  IdentifiantPotentielPPE2Batiment2Corrigé,
  DonnéesDeRaccordementRenseignées,
  LegacyAbandonSupprimé,
  AbandonProjetAnnulé,
} from '@modules/project';
import { ContratEDFRapprochéAutomatiquement, ContratEDFMisAJour } from '@modules/edf';
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim';
import { onAppelOffreProjetModifié } from './onAppelOffreProjetModifié';
import { onCovidDelayGranted } from './onCovidDelayGranted';
import { onProjectAbandoned } from './onProjectAbandoned';
import { onProjectActionnaireUpdated } from './onProjectActionnaireUpdated';
import { onProjectCertificateGenerated } from './onProjectCertificateGenerated';
import { onProjectCertificateRegenerated } from './onProjectCertificateRegenerated';
import { onProjectCertificateUpdated } from './onProjectCertificateUpdated';
import { onProjectCertificateObsolete } from './onProjectCertificateObsolete';
import { onProjectClaimed } from './onProjectClaimed';
import { onProjectClasseGranted } from './onProjectClasseGranted';
import { onProjectCompletionDueDateCancelled } from './onProjectCompletionDueDateCancelled';
import { onProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet';
import { onProjectDataCorrected } from './onProjectDataCorrected';
import { onProjectDCRDueDateCancelled } from './onProjectDCRDueDateCancelled';
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet';
import { onProjectFournisseursUpdated } from './onProjectFournisseursUpdated';
import { onProjectImported } from './onProjectImported';
import { onCahierDesChargesChoisi } from './onCahierDesChargesChoisi';
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet';
import { onProjectProducteurUpdated } from './onProjectProducteurUpdated';
import { onProjectPuissanceUpdated } from './onProjectPuissanceUpdated';
import { onProjectReimported } from './onProjectReimported';
import { onContratEDFRapprochéAutomatiquement } from './onContratEDFRapprochéAutomatiquement';
import { onContratEDFMisAJour } from './onContratEDFMisAJour';
import {
  ContratEnedisRapprochéAutomatiquement,
  ContratEnedisMisAJour,
} from '../../../../../modules/enedis';
import { onContratEnedisMisAJour } from './onContratEnedisMisAJour';
import { onContratEnedisRapprochéAutomatiquement } from './onContratEnedisRapprochéAutomatiquement';
import { onIdentifiantPotentielPPE2Batiment2Corrigé } from './onIdentifiantPotentielPPE2Batiment2Corrigé';
import { onDonnéesDeRaccordementRenseignées } from './onDonnéesDeRaccordementRenseignées';

import { onLegacyAbandonSupprimé } from './onLegacyAbandonSupprimé';
import { onAbandonProjetAnnulé } from './onAbandonProjetAnnulé';

export const initProjectProjections = (eventBus: EventBus) => {
  eventBus.subscribe(ProjectImported.type, onProjectImported);
  eventBus.subscribe(ProjectReimported.type, onProjectReimported);
  eventBus.subscribe(ProjectDataCorrected.type, onProjectDataCorrected);
  eventBus.subscribe(ProjectDCRDueDateSet.type, onProjectDCRDueDateSet);
  eventBus.subscribe(ProjectDCRDueDateCancelled.type, onProjectDCRDueDateCancelled);
  eventBus.subscribe(ProjectCompletionDueDateSet.type, onProjectCompletionDueDateSet);
  eventBus.subscribe(ProjectCompletionDueDateCancelled.type, onProjectCompletionDueDateCancelled);
  eventBus.subscribe(ProjectNotified.type, onProjectNotificationDateSet);
  eventBus.subscribe(ProjectNotificationDateSet.type, onProjectNotificationDateSet);
  eventBus.subscribe(ProjectCertificateGenerated.type, onProjectCertificateGenerated);
  eventBus.subscribe(ProjectCertificateRegenerated.type, onProjectCertificateRegenerated);
  eventBus.subscribe(ProjectCertificateUpdated.type, onProjectCertificateUpdated);

  eventBus.subscribe(ProjectClasseGranted.type, onProjectClasseGranted);

  eventBus.subscribe(ProjectAbandoned.type, onProjectAbandoned);
  eventBus.subscribe(ProjectPuissanceUpdated.type, onProjectPuissanceUpdated);
  eventBus.subscribe(ProjectActionnaireUpdated.type, onProjectActionnaireUpdated);
  eventBus.subscribe(ProjectProducteurUpdated.type, onProjectProducteurUpdated);
  eventBus.subscribe(ProjectFournisseursUpdated.type, onProjectFournisseursUpdated);
  eventBus.subscribe(CahierDesChargesChoisi.type, onCahierDesChargesChoisi);
  eventBus.subscribe(ProjectClaimed.type, onProjectClaimed);
  eventBus.subscribe(ProjectClaimedByOwner.type, onProjectClaimed);

  eventBus.subscribe(ProjectCertificateObsolete.type, onProjectCertificateObsolete);

  eventBus.subscribe(CovidDelayGranted.type, onCovidDelayGranted);
  eventBus.subscribe(AppelOffreProjetModifié.type, onAppelOffreProjetModifié);

  eventBus.subscribe(ContratEDFRapprochéAutomatiquement.type, onContratEDFRapprochéAutomatiquement);
  eventBus.subscribe(ContratEDFMisAJour.type, onContratEDFMisAJour);

  eventBus.subscribe(
    ContratEnedisRapprochéAutomatiquement.type,
    onContratEnedisRapprochéAutomatiquement,
  );
  eventBus.subscribe(ContratEnedisMisAJour.type, onContratEnedisMisAJour);

  eventBus.subscribe(
    IdentifiantPotentielPPE2Batiment2Corrigé.type,
    onIdentifiantPotentielPPE2Batiment2Corrigé,
  );

  eventBus.subscribe(DonnéesDeRaccordementRenseignées.type, onDonnéesDeRaccordementRenseignées);

  eventBus.subscribe(LegacyAbandonSupprimé.type, onLegacyAbandonSupprimé);

  eventBus.subscribe(AbandonProjetAnnulé.type, onAbandonProjetAnnulé);

  logger.info('Initialized Project projections');
};
