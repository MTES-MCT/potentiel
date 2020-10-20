import { Optional } from 'utility-types'

import { Project, User, DREAL } from '../../entities'
import { AggregateRoot, UniqueEntityID, DomainError } from '../../core/domain'
import { Result, ok } from '../../core/utils'
import { StoredEvent } from '../eventStore'

type BaseNotification = {
  message: {
    email: string
    name?: string
    subject: string
  }
  status: 'sent' | 'error' | 'retried'
  error?: string
  createdAt?: Date
  updatedAt?: Date
}

type Designation = {
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

type RelanceDesignation = {
  type: 'relance-designation'
  context: {
    projectAdmissionKeyId: string
  }
  variables: {
    invitation_link: string
  }
}

type ProjectInvitation = {
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

type DrealInvitation = {
  type: 'dreal-invitation'
  context: {
    projectAdmissionKeyId: string
    dreal: DREAL
  }
  variables: {
    invitation_link: string
  }
}

type PasswordReset = {
  type: 'password-reset'
  context: {
    passwordRetrievalId: string
    userId: string
  }
  variables: {
    password_reset_link: string
  }
}

type PP_GF_Notification = {
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

type DREAL_GF_Notification = {
  type: 'dreal-gf-notification'
  context: {
    projectId: string
    userId?: string
    dreal: string
  }
  variables: {
    nomProjet: string
    departementProjet: string
    invitation_link: string
  }
}

type RelanceGarantiesFinancieres = {
  type: 'relance-gf'
  context: {
    projectId: Project['id']
    userId: User['id']
  }
  variables: {
    nom_projet: string
    code_projet: string
    date_designation: string
    paragraphe_cdc: string
    duree_garanties: string
    invitation_link: string
  }
}

type NotificationVariants =
  | Designation
  | RelanceDesignation
  | ProjectInvitation
  | DrealInvitation
  | PasswordReset
  | PP_GF_Notification
  | DREAL_GF_Notification
  | RelanceGarantiesFinancieres

export type NotificationProps = BaseNotification & NotificationVariants

// No idea why: Optional<NotificationProps, 'status'> does not work
export type NotificationArgs = Optional<BaseNotification, 'status'> &
  NotificationVariants

export class Notification extends AggregateRoot<
  NotificationProps,
  StoredEvent
> {
  private constructor(props: NotificationProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get type() {
    return this.props.type
  }

  get status() {
    return this.props.status
  }

  get message() {
    return this.props.message
  }

  get error() {
    return this.props.error
  }

  get context() {
    return this.props.context
  }

  get variables() {
    return this.props.variables
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public sent() {
    this.props.status = 'sent'
  }

  public retried() {
    this.props.status = 'retried'
  }

  public setError(error: string) {
    this.props.status = 'error'
    this.props.error = error
  }

  public static clone(notification: Notification): Notification {
    const { type, message, context, variables, status } = notification

    const clone = new Notification({
      type,
      message,
      context,
      variables,
      status,
    } as any)

    return clone
  }

  public static create(
    args: NotificationArgs,
    id?: UniqueEntityID
  ): Result<Notification, DomainError> {
    const notification = new Notification(
      {
        ...args,
        status: args.status || 'sent',
        createdAt: args.createdAt || new Date(),
      },
      id
    )

    return ok(notification)
  }
}
