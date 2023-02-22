import { DomainEvent } from '@core/domain';

type DetailErreurProjectionEnEchec = {
  nomProjection: string;
  évènement: DomainEvent;
};

export class ProjectionEnEchec extends Error {
  constructor(message: string, public details: DetailErreurProjectionEnEchec, cause?: Error) {
    super(message, { cause });
  }
}
