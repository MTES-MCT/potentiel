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

export type RelanceDesignation = {
  type: 'relance-designation'
  context: {
    projectAdmissionKeyId: string
  }
  variables: {
    invitation_link: string
  }
}

export type ProjectInvitation = {
  type: 'project-invitation'
  context: {
    projectAdmissionKeyId?: string
    userId?: string
    projectId: string
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
    password_reset_link: string
  }
}

export type PP_GF_Notification = {
  type: 'pp-gf-notification'
  context: {
    projectId: string
    userId: string
  }
  variables: {
    nomProjet: string
    dreal: string
    date_depot: string
  }
}

export type DREAL_GF_Notification = {
  type: 'dreal-gf-notification'
  context: {
    projectId: string
    userId?: string
    dreal: string
  }
  variables: {
    nomProjet: string
    invitation_link: string
  }
}

export type NotificationProps = BaseNotification &
  (
    | Designation
    | RelanceDesignation
    | ProjectInvitation
    | DrealInvitation
    | PasswordReset
    | PP_GF_Notification
    | DREAL_GF_Notification
  )

type NotificationWithStatus = NotificationProps & {
  status: 'sent' | 'error' | 'retried'
  error?: string
}

export type Notification = NotificationWithStatus & {
  id: string
  createdAt: number
  updatedAt: number
}

interface MakeNotificationDependencies {
  makeId: () => string
}

export default ({ makeId }: MakeNotificationDependencies) => (
  notification: NotificationWithStatus
): Notification => ({
  id: makeId(),
  createdAt: Date.now(),
  updatedAt: 0,
  ...notification,
})
