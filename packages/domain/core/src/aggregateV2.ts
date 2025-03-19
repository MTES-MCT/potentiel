import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type Publish = <TDomainEvent extends DomainEvent>(
  aggregateId: string,
  event: TDomainEvent,
) => Promise<void>;

export abstract class AbstractAggregate<TDomainEvent extends DomainEvent> {
  readonly #aggregateId: string;

  get aggregateId() {
    return this.#aggregateId;
  }

  #version: number;

  get version() {
    return this.#version;
  }

  #publish: Publish;

  get exists() {
    return this.version > 0;
  }

  constructor(aggregateId: string, version: number, publish: Publish) {
    this.#aggregateId = aggregateId;
    this.#version = version;
    this.#publish = publish;
  }

  abstract apply(event: TDomainEvent): void;

  async publish(event: TDomainEvent) {
    await this.#publish<TDomainEvent>(this.aggregateId, event);
    this.apply(event);
    this.#version++;
  }
}

export type AggregateType<
  TAggregate extends AbstractAggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent = DomainEvent,
> = Omit<TAggregate, 'aggregateId' | 'version' | 'apply'>;

export type LoadAggregateV2 = <
  TDomainEvent extends DomainEvent,
  TAggregate extends AbstractAggregate<TDomainEvent>,
>(
  aggregateId: AggregateId,
  ctor: new (aggregateId: string, version: number, publish: Publish) => TAggregate,
) => Promise<AggregateType<TAggregate>>;
