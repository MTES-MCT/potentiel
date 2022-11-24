import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import {
  AppelOffreProjetModifié,
  CovidDelayGranted,
  NumeroGestionnaireSubmitted,
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
  ProjectDCRSubmitted,
  ProjectFournisseursUpdated,
  ProjectGFDueDateCancelled,
  ProjectGFDueDateSet,
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
  ProjectGFRemoved,
} from '@modules/project'
import { ContratEDFRapprochéAutomatiquement, ContratEDFMisAJour } from '@modules/edf'
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim'
import { onAppelOffreProjetModifié } from './onAppelOffreProjetModifié'
import { onCovidDelayGranted } from './onCovidDelayGranted'
import { onNumeroGestionnaireSubmitted } from './onNumeroGestionnaireSubmitted'
import { onProjectAbandoned } from './onProjectAbandoned'
import { onProjectActionnaireUpdated } from './onProjectActionnaireUpdated'
import { onProjectCertificate } from './onProjectCertificate'
import { onProjectCertificateObsolete } from './onProjectCertificateObsolete'
import { onProjectClaimed } from './onProjectClaimed'
import { onProjectClasseGranted } from './onProjectClasseGranted'
import { onProjectCompletionDueDateCancelled } from './onProjectCompletionDueDateCancelled'
import { onProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet'
import { onProjectDataCorrected } from './onProjectDataCorrected'
import { onProjectDCRDueDateCancelled } from './onProjectDCRDueDateCancelled'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'
import { onProjectDCRSubmitted } from './onProjectDCRSubmitted'
import { onProjectFournisseursUpdated } from './onProjectFournisseursUpdated'
import { onProjectGFDueDateCancelled } from './onProjectGFDueDateCancelled'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'
import { onProjectImported } from './onProjectImported'
import { onCahierDesChargesChoisi } from './onCahierDesChargesChoisi'
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet'
import { onProjectProducteurUpdated } from './onProjectProducteurUpdated'
import { onProjectPuissanceUpdated } from './onProjectPuissanceUpdated'
import { onProjectReimported } from './onProjectReimported'
import { onContratEDFRapprochéAutomatiquement } from './onContratEDFRapprochéAutomatiquement'
import { onContratEDFMisAJour } from './onContratEDFMisAJour'
import {
  ContratEnedisRapprochéAutomatiquement,
  ContratEnedisMisAJour,
} from '../../../../../modules/enedis'
import { onContratEnedisMisAJour } from './onContratEnedisMisAJour'
import { onContratEnedisRapprochéAutomatiquement } from './onContratEnedisRapprochéAutomatiquement'
import { onIdentifiantPotentielPPE2Batiment2Corrigé } from './onIdentifiantPotentielPPE2Batiment2Corrigé'
import { onDonnéesDeRaccordementRenseignées } from './onDonnéesDeRaccordementRenseignées'

import { Projections } from '@infra/sequelize/models'
import { onLegacyAbandonSupprimé } from './onLegacyAbandonSupprimé'

export const initProjectProjections = (eventBus: EventBus, models: Projections) => {
  eventBus.subscribe(ProjectImported.type, onProjectImported(models))
  eventBus.subscribe(ProjectReimported.type, onProjectReimported(models))
  eventBus.subscribe(ProjectDataCorrected.type, onProjectDataCorrected(models))
  eventBus.subscribe(ProjectDCRDueDateSet.type, onProjectDCRDueDateSet(models))
  eventBus.subscribe(ProjectDCRDueDateCancelled.type, onProjectDCRDueDateCancelled(models))
  eventBus.subscribe(ProjectGFDueDateSet.type, onProjectGFDueDateSet(models))
  eventBus.subscribe(ProjectGFDueDateCancelled.type, onProjectGFDueDateCancelled(models))
  eventBus.subscribe(ProjectGFRemoved.type, onProjectGFRemoved(models))
  eventBus.subscribe(ProjectCompletionDueDateSet.type, onProjectCompletionDueDateSet(models))
  eventBus.subscribe(
    ProjectCompletionDueDateCancelled.type,
    onProjectCompletionDueDateCancelled(models)
  )
  eventBus.subscribe(ProjectNotified.type, onProjectNotificationDateSet(models))
  eventBus.subscribe(ProjectNotificationDateSet.type, onProjectNotificationDateSet(models))
  eventBus.subscribe(ProjectCertificateGenerated.type, onProjectCertificate(models))
  eventBus.subscribe(ProjectCertificateRegenerated.type, onProjectCertificate(models))
  eventBus.subscribe(ProjectCertificateUpdated.type, onProjectCertificate(models))

  eventBus.subscribe(ProjectClasseGranted.type, onProjectClasseGranted(models))

  eventBus.subscribe(NumeroGestionnaireSubmitted.type, onNumeroGestionnaireSubmitted(models))

  eventBus.subscribe(ProjectDCRSubmitted.type, onProjectDCRSubmitted(models))
  eventBus.subscribe(ProjectAbandoned.type, onProjectAbandoned(models))
  eventBus.subscribe(ProjectPuissanceUpdated.type, onProjectPuissanceUpdated(models))
  eventBus.subscribe(ProjectActionnaireUpdated.type, onProjectActionnaireUpdated(models))
  eventBus.subscribe(ProjectProducteurUpdated.type, onProjectProducteurUpdated(models))
  eventBus.subscribe(ProjectFournisseursUpdated.type, onProjectFournisseursUpdated(models))
  eventBus.subscribe(CahierDesChargesChoisi.type, onCahierDesChargesChoisi(models))
  eventBus.subscribe(ProjectClaimed.type, onProjectClaimed(models))
  eventBus.subscribe(ProjectClaimedByOwner.type, onProjectClaimed(models))

  eventBus.subscribe(ProjectCertificateObsolete.type, onProjectCertificateObsolete(models))

  eventBus.subscribe(CovidDelayGranted.type, onCovidDelayGranted(models))
  eventBus.subscribe(AppelOffreProjetModifié.type, onAppelOffreProjetModifié(models))

  eventBus.subscribe(
    ContratEDFRapprochéAutomatiquement.type,
    onContratEDFRapprochéAutomatiquement(models)
  )
  eventBus.subscribe(ContratEDFMisAJour.type, onContratEDFMisAJour(models))

  eventBus.subscribe(
    ContratEnedisRapprochéAutomatiquement.type,
    onContratEnedisRapprochéAutomatiquement(models)
  )
  eventBus.subscribe(ContratEnedisMisAJour.type, onContratEnedisMisAJour(models))

  eventBus.subscribe(
    IdentifiantPotentielPPE2Batiment2Corrigé.type,
    onIdentifiantPotentielPPE2Batiment2Corrigé(models)
  )

  eventBus.subscribe(
    DonnéesDeRaccordementRenseignées.type,
    onDonnéesDeRaccordementRenseignées(models)
  )

  eventBus.subscribe(LegacyAbandonSupprimé.type, onLegacyAbandonSupprimé(models))

  logger.info('Initialized Project projections')
}
