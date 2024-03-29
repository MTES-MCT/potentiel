import { LegacyCandidateNotified } from '.';
import { DomainEvent, UniqueEntityID, EventStoreAggregate } from '../../core/domain';
import { ok, Result } from '../../core/utils';
import { EntityNotFoundError } from '../shared';
import { HeterogeneousHistoryError } from '../shared/errors';

export interface LegacyCandidateNotification extends EventStoreAggregate {
  notify: () => Result<null, never>;
}

interface LegacyCandidateNotificationProps {
  isAlreadyNotified: boolean;
}

export const makeLegacyCandidateNotification = (args: {
  events?: DomainEvent[];
  id: UniqueEntityID;
}): Result<LegacyCandidateNotification, EntityNotFoundError | HeterogeneousHistoryError> => {
  const { events, id } = args;

  const { importId, email } = parseLegacyCandidateNotificationId(id.toString());

  const props: LegacyCandidateNotificationProps = {
    isAlreadyNotified: false,
  };

  const pendingEvents: DomainEvent[] = [];

  if (events) {
    for (const event of events) {
      switch (event.type) {
        case LegacyCandidateNotified.type:
          props.isAlreadyNotified = true;
          break;
        default:
          // ignore other event types
          break;
      }
    }
  }

  return ok({
    notify: () => {
      if (!props.isAlreadyNotified) {
        pendingEvents.push(
          new LegacyCandidateNotified({
            payload: {
              importId,
              email,
            },
          }),
        );
      }

      return ok(null);
    },
    get pendingEvents() {
      return pendingEvents;
    },
    get id() {
      return id;
    },
    get lastUpdatedOn() {
      // no versionning here
      return new Date(0);
    },
  });
};

export const parseLegacyCandidateNotificationId = (
  id: string,
): { importId: string; email: string } => {
  return JSON.parse(id);
};
