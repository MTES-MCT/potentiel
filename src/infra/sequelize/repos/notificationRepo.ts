import { DomainError, Repository, UniqueEntityID } from '../../../core/domain'
import { err, errAsync, Result, ResultAsync, wrapInfra } from '../../../core/utils'
import { Notification } from '@modules/notification'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'

export class NotificationRepo implements Repository<Notification> {
  private models: any

  constructor(models: any) {
    this.models = models
  }

  private toDomain(db: any): Result<Notification, DomainError> {
    return Notification.create(
      {
        message: db.message,
        status: db.status,
        type: db.type,
        context: db.context,
        variables: db.variables,
        error: db.error || undefined,
        createdAt: db.createdAt,
      },
      new UniqueEntityID(db.id)
    )
  }

  private toPersistence(notification: Notification): any {
    return {
      id: notification.id.toString(),
      message: notification.message,
      status: notification.status,
      type: notification.type,
      context: notification.context,
      variables: notification.variables,
      error: notification.error || undefined,
      createdAt: notification.createdAt || new Date(),
    }
  }

  save(aggregate: Notification): ResultAsync<null, DomainError> {
    const NotificationModel = this.models.Notification
    if (!NotificationModel) return errAsync(new InfraNotAvailableError())

    return wrapInfra(NotificationModel.upsert(this.toPersistence(aggregate)))
  }

  load(id: UniqueEntityID): ResultAsync<Notification, DomainError> {
    const NotificationModel = this.models.Notification
    if (!NotificationModel) return errAsync(new InfraNotAvailableError())

    return wrapInfra(NotificationModel.findByPk(id.toString())).andThen((dbResult) =>
      dbResult ? this.toDomain(dbResult) : err(new EntityNotFoundError())
    )
  }
}
