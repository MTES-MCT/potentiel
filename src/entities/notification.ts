import {
  String,
  Number,
  Record,
  Array,
  Union,
  Literal,
  Boolean,
  Static,
  Unknown,
  Undefined,
} from '../types/schemaTypes'
import buildMakeEntity from '../helpers/buildMakeEntity'
import { Project } from './project'
import { User } from './user'
import { DREAL } from './dreal'
import { Required } from 'utility-types'

type BaseNotification = {
  message: {
    email: string
    name?: string
    subject: string
  }
}

export type Designation = {
  type: 'designation'
  context: {
    projectAdmissionKeyId: string
    appelOffreId: string
    periodeId: string
  }
  variables: {
    invitation_link: string
  }
}

export type ProjectInvitation = {
  type: 'project-invitation'
  context: {
    projectAdmissionKeyId: string
    projectId: string
    userId: string
  }
  variables: {
    invitation_link: string
    nomProjet: string
  }
}

export type DrealInvitation = {
  type: 'dreal-invitation'
  context: {
    projectAdmissionKeyId: string
    userId: string
    dreal: DREAL
  }
  variables: {
    invitation_link: string
  }
}

export type PasswordReset = {
  type: 'password-reset'
  context: {
    passwordRetrievalId: string
    userId: string
  }
  variables: {
    reset_link: string
  }
}

export type NotificationProps = BaseNotification &
  (Designation | ProjectInvitation | DrealInvitation | PasswordReset)

type NotificationWithStatus = NotificationProps & {
  status: 'sent' | 'error'
  error?: string
}

export type Notification = NotificationWithStatus & { id: string }

interface MakeNotificationDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeNotificationDependencies) => (
  notification: NotificationWithStatus
): Notification => ({
  id: makeId(),
  ...notification,
})
