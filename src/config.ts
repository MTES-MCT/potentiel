import { FileService, FileStorageService } from './modules/file'
import {
  BaseShouldUserAccessProject,
  ShouldUserAccessProject,
} from './modules/authorization'
import { userRepo, projectRepo, projectAdmissionKeyRepo } from './dataAccess'
import { appelOffreRepo } from './dataAccess/inMemory'
import {
  fileRepo,
  notificationRepo,
  getFailedNotifications,
  getUnnotifiedProjectsForPeriode,
  initProjections,
} from './infra/sequelize'
import {
  LocalFileStorageService,
  ObjectStorageFileStorageService,
} from './infra/file'
import { InMemoryEventStore } from './infra/inMemory'
import { fakeSendEmail } from './infra/mail/fakeEmailService'
import { sendEmailFromMailjet } from './infra/mail/mailjet'

import {
  handlePeriodeNotified,
  handleProjectCertificateGenerated,
  handleProjectNotified,
  handleCandidateNotifiedForPeriode,
} from './modules/project/eventHandlers'
import {
  GenerateCertificate,
  makeGenerateCertificate,
} from './modules/project/generateCertificate'
import { buildCertificate } from './views/certificates'
import { makeNotificationService, SendEmail } from './modules/notification'

if (
  !['test', 'development', 'staging', 'production'].includes(
    process.env.NODE_ENV || ''
  )
) {
  console.log('ERROR: NODE_ENV not recognized')
  process.exit(1)
}

const isTestEnv = process.env.NODE_ENV === 'test'
const isDevEnv = process.env.NODE_ENV === 'development'
const isStagingEnv = process.env.NODE_ENV === 'staging'
const isProdEnv = process.env.NODE_ENV === 'production'

const shouldUserAccessProject = new BaseShouldUserAccessProject(
  userRepo,
  projectRepo.findById
)

//
// Files
//

let fileStorageService: FileStorageService
if (isStagingEnv || isProdEnv) {
  const authUrl = process.env.OS_AUTH_URL
  const region = process.env.OS_REGION
  const username = process.env.OS_USERNAME
  const password = process.env.OS_PASSWORD
  const container = process.env.OS_CONTAINER

  if (!authUrl || !region || !username || !password || !container) {
    console.log(
      'Cannot start ObjectStorageFileStorageService because of missing environment variables (OS_AUTH_URL, OS_REGION, OS_USERNAME, OS_PASSWORD, OS_CONTAINER)'
    )
    process.exit(1)
  }

  fileStorageService = new ObjectStorageFileStorageService(
    {
      provider: 'openstack',
      keystoneAuthVersion: 'v3',
      authUrl,
      region,
      username,
      password,
      // @ts-ignore
      domainId: 'default',
    },
    container
  )

  console.log(
    'FileService will be using ObjectStorage on container ' + container
  )
} else {
  console.log('FileService will be using LocalFileStorage is userData/')
  fileStorageService = new LocalFileStorageService('userData')
}

export const fileService = new FileService(
  fileStorageService,
  fileRepo,
  shouldUserAccessProject
)

//
// EMAILS
//

const sendEmail: SendEmail =
  process.env.NODE_ENV !== 'production' ? fakeSendEmail : sendEmailFromMailjet

if (!process.env.SEND_EMAILS_FROM) {
  console.log('ERROR: SEND_EMAILS_FROM is not set')
  process.exit(1)
}

export const {
  sendNotification,
  retryFailedNotifications,
} = makeNotificationService({
  sendEmail,
  emailSenderAddress: process.env.SEND_EMAILS_FROM,
  notificationRepo,
  getFailedNotifications,
})

//
// EVENT HANDLERS
//

export const eventStore = new InMemoryEventStore()

export const generateCertificate = makeGenerateCertificate({
  fileService,
  findProjectById: projectRepo.findById,
  saveProject: projectRepo.save,
  buildCertificate,
})
handlePeriodeNotified(eventStore, getUnnotifiedProjectsForPeriode)
handleProjectCertificateGenerated(eventStore, {
  findProjectById: projectRepo.findById,
})
handleProjectNotified(eventStore, {
  generateCertificate,
  getFamille: appelOffreRepo.getFamille,
})
handleCandidateNotifiedForPeriode(eventStore, {
  sendNotification,
  saveProjectAdmissionKey: projectAdmissionKeyRepo.save,
  getPeriodeTitle: appelOffreRepo.getPeriodeTitle,
})

//
// Projections
//

initProjections(eventStore)
