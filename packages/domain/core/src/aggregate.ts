import { AggregateId } from './aggregateId.js';
import { DomainEvent } from './domainEvent.js';

export type Publish = <TDomainEvent extends DomainEvent>(
  aggregateId: string,
  event: TDomainEvent,
) => Promise<void>;

export abstract class AbstractAggregate<
  TDomainEvent extends DomainEvent,
  TCategory extends string,
  TParent = unknown,
> {
  readonly #parent: TParent;

  get parent(): TParent {
    return this.#parent;
  }

  readonly #aggregateId: string;

  get aggregateId() {
    return this.#aggregateId;
  }

  readonly #category: TCategory;

  get category() {
    return this.#category;
  }

  #version: number;

  get version() {
    return this.#version;
  }

  #publish: Publish;
  #loadAggregate: LoadAggregate;

  get exists() {
    return this.version > 0;
  }

  constructor(
    parent: TParent,
    aggregateId: AggregateId<TCategory>,
    version: number,
    publish: Publish,
    loadAggregate: LoadAggregate,
  ) {
    this.#parent = parent;
    this.#aggregateId = aggregateId;
    this.#version = version;
    this.#publish = publish;
    this.#category = aggregateId.split('|')[0] as TCategory;
    this.#loadAggregate = loadAggregate;
  }

  abstract apply(event: TDomainEvent): void;

  protected async publish(event: TDomainEvent) {
    await this.#publish<TDomainEvent>(this.aggregateId, event);
    this.apply(event);
    this.#version++;
  }

  protected async loadAggregate<
    TDomainEvent extends DomainEvent,
    TAggregate extends AbstractAggregate<TDomainEvent, string>,
  >(
    ctor: AggregateConstructor<TAggregate, TDomainEvent>,
    aggregateId: AggregateId<TAggregate['category']>,
  ) {
    return this.#loadAggregate(ctor, aggregateId, this);
  }
}

export type AggregateType<
  TAggregate extends AbstractAggregate<TDomainEvent, string>,
  TDomainEvent extends DomainEvent = DomainEvent,
> = Omit<TAggregate, 'aggregateId' | 'version' | 'apply'>;

type AggregateConstructor<
  TAggregate extends AbstractAggregate<TDomainEvent, string>,
  TDomainEvent extends DomainEvent = DomainEvent,
> = new (
  parent: TAggregate['parent'],
  aggregateId: AggregateId<TAggregate['category']>,
  version: number,
  publish: Publish,
  loadAggregate: LoadAggregate,
) => TAggregate;

export type LoadAggregate = <
  TDomainEvent extends DomainEvent,
  TAggregate extends AbstractAggregate<TDomainEvent, string>,
>(
  ctor: AggregateConstructor<TAggregate, TDomainEvent>,
  aggregateId: AggregateId<TAggregate['category']>,
  parent: TAggregate['parent'],
) => Promise<AggregateType<TAggregate>>;
