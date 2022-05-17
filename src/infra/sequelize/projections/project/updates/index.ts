import {
  ProjectCertificateGenerated,
  ProjectCertificateRegenerated,
  ProjectCertificateUpdated,
  ProjectClasseGranted,
  ProjectDataCorrected,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectNotificationDateSet,
  ProjectNotified,
  ProjectDCRSubmitted,
  ProjectCompletionDueDateSet,
  NumeroGestionnaireSubmitted,
  ProjectAbandoned,
  ProjectPuissanceUpdated,
  ProjectActionnaireUpdated,
  ProjectProducteurUpdated,
  ProjectGFInvalidated,
  ProjectFournisseursUpdated,
  ProjectNewRulesOptedIn,
  ProjectImported,
  ProjectReimported,
  ProjectCompletionDueDateCancelled,
  ProjectDCRDueDateCancelled,
  ProjectGFDueDateCancelled,
  ProjectCertificateObsolete,
  CovidDelayGranted,
  AppelOffreProjetModifié,
} from '@modules/project'
import { onProjectImported } from './onProjectImported'
import { onProjectCertificate } from './onProjectCertificate'
import { onProjectDataCorrected } from './onProjectDataCorrected'
import { onProjectDCRDueDateSet } from './onProjectDCRDueDateSet'
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet'
import { onProjectGFInvalidated } from './onProjectGFInvalidated'
import { onProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet'
import { onProjectNotificationDateSet } from './onProjectNotificationDateSet'
import { onProjectClasseGranted } from './onProjectClasseGranted'
import { onNumeroGestionnaireSubmitted } from './onNumeroGestionnaireSubmitted'
import { onProjectDCRSubmitted } from './onProjectDCRSubmitted'
import { onProjectAbandoned } from './onProjectAbandoned'
import { onProjectPuissanceUpdated } from './onProjectPuissanceUpdated'
import { onProjectActionnaireUpdated } from './onProjectActionnaireUpdated'
import { onProjectProducteurUpdated } from './onProjectProducteurUpdated'
import { onProjectFournisseursUpdated } from './onProjectFournisseursUpdated'
import { onProjectNewRulesOptedIn } from './onProjectNewRulesOptedIn'
import { logger } from '@core/utils'
import { onProjectReimported } from './onProjectReimported'
import { onProjectClaimed } from './onProjectClaimed'
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim'
import { EventBus } from '@core/domain'
import { onProjectCompletionDueDateCancelled } from './onProjectCompletionDueDateCancelled'
import { onProjectDCRDueDateCancelled } from './onProjectDCRDueDateCancelled'
import { onProjectGFDueDateCancelled } from './onProjectGFDueDateCancelled'
import { onProjectCertificateObsolete } from './onProjectCertificateObsolete'
import { onCovidDelayGranted } from './onCovidDelayGranted'
import { onAppelOffreProjetModifié } from './onAppelOffreProjetModifié'

export const initProjectProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectImported.type, onProjectImported(models))
  eventBus.subscribe(ProjectReimported.type, onProjectReimported(models))
  eventBus.subscribe(ProjectDataCorrected.type, onProjectDataCorrected(models))
  eventBus.subscribe(ProjectDCRDueDateSet.type, onProjectDCRDueDateSet(models))
  eventBus.subscribe(ProjectDCRDueDateCancelled.type, onProjectDCRDueDateCancelled(models))
  eventBus.subscribe(ProjectGFDueDateSet.type, onProjectGFDueDateSet(models))
  eventBus.subscribe(ProjectGFDueDateCancelled.type, onProjectGFDueDateCancelled(models))
  eventBus.subscribe(ProjectGFInvalidated.type, onProjectGFInvalidated(models))
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
  eventBus.subscribe(ProjectNewRulesOptedIn.type, onProjectNewRulesOptedIn(models))
  eventBus.subscribe(ProjectClaimed.type, onProjectClaimed(models))
  eventBus.subscribe(ProjectClaimedByOwner.type, onProjectClaimed(models))

  eventBus.subscribe(ProjectCertificateObsolete.type, onProjectCertificateObsolete(models))

  eventBus.subscribe(CovidDelayGranted.type, onCovidDelayGranted(models))
  eventBus.subscribe(AppelOffreProjetModifié.type, onAppelOffreProjetModifié(models))

  logger.info('Initialized Project projections')
}
