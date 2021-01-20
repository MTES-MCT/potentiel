import { Repository, DomainError, UniqueEntityID } from '../../../core/domain'
import { Result, ResultAsync, errAsync, err, logger } from '../../../core/utils'
import { Notification } from '../../../modules/notification'
import { InfraNotAvailableError, EntityNotFoundError } from '../../../modules/shared'

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

    return ResultAsync.fromPromise<null, DomainError>(
      NotificationModel.upsert(this.toPersistence(aggregate)),
      (e: any) => {
        logger.error(e)
        return new InfraNotAvailableError()
      }
    )
  }

  load(id: UniqueEntityID): ResultAsync<Notification, DomainError> {
    const NotificationModel = this.models.Notification
    if (!NotificationModel) return errAsync(new InfraNotAvailableError())

    return ResultAsync.fromPromise<Notification, DomainError>(
      NotificationModel.findByPk(id.toString()),
      (e: any) => {
        logger.error(e)
        return new InfraNotAvailableError()
      }
    ).andThen((dbResult) => (dbResult ? this.toDomain(dbResult) : err(new EntityNotFoundError())))
  }
}
