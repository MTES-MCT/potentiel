import { DomainEvent } from '@core/domain';

export type Subscribe = (cb: (event: DomainEvent) => Promise<void>, consumerName: string) => void;
