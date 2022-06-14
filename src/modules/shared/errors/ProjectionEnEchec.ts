import { DomainEvent } from '@core/domain'

type DetailErreurProjectionEnEchec = {
  nomProjection: string
  evenement: DomainEvent
}

export class ProjectionEnEchec extends Error {
  constructor(message: string, public details: DetailErreurProjectionEnEchec, cause?: Error) {
    super(message, { cause })
  }
}
