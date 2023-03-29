import { DomainEvent } from './domainEvent';

export type DomainEventHandler<TDomainEvent extends DomainEvent> = (
  domainEvent: TDomainEvent,
) => Promise<void>;

export type DomainEventHandlerFactory<
  TDomainEvent extends DomainEvent,
  TDependencies extends Record<string, unknown>,
> = (dependencies: TDependencies) => DomainEventHandler<TDomainEvent>;
