import { is, ModificationRequestDTO, ProjectEventDTO } from '../../../../modules/frise';
import { or } from '../../../../core/utils';
import { makeDocumentUrl } from '.';
import { UserRole } from '../../../../modules/users';
import ROUTES from '@potentiel/routes';

export type ModificationRequestItemProps = {
  type: 'demande-de-modification';
  date: number;
  status: 'envoyée' | 'en instruction' | 'acceptée' | 'rejetée' | 'annulée';
  authority: 'dreal' | 'dgec' | undefined;
  role: UserRole;
  responseUrl?: string | undefined;
  detailsUrl: string;
} & (
  | {
      modificationType: 'delai';
      delayInMonths: number;
    }
  | {
      modificationType: 'puissance';
      puissance: number;
      unitePuissance: string;
    }
  | {
      modificationType: 'recours';
    }
);

export const extractModificationRequestsItemProps = (
  events: ProjectEventDTO[],
): ModificationRequestItemProps[] => {
  const modificationRequestEvents = events.filter(isModificationRequestEvent);
  if (modificationRequestEvents.length === 0) {
    return [];
  }

  const modificationRequestGroups =
    getEventsGroupedByModificationRequestId(modificationRequestEvents);

  const propsArray: ModificationRequestItemProps[] = Object.entries(modificationRequestGroups)
    .filter(([, events]) => events.find(is('ModificationRequested')))
    .map(([, events]): ModificationRequestItemProps => {
      const latestEvent = getLatestEvent(events);
      const requestEvent = getRequestEvent(events);

      const { date, variant: role } = latestEvent;
      const { authority, modificationType } = requestEvent;
      const status = getStatus(latestEvent);
      const responseUrl = getResponseUrl(latestEvent);
      const detailsUrl = ROUTES.DEMANDE_PAGE_DETAILS(requestEvent.modificationRequestId);

      switch (modificationType) {
        case 'delai':
          return {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            responseUrl,
            delayInMonths:
              latestEvent.type === 'ModificationRequestAccepted' && latestEvent.delayInMonthsGranted
                ? latestEvent.delayInMonthsGranted
                : requestEvent.delayInMonths,
            detailsUrl,
          };

        case 'puissance':
          return {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            responseUrl,
            puissance: requestEvent.puissance,
            unitePuissance: requestEvent.unitePuissance || '??',
            detailsUrl,
          };

        case 'recours':
          return {
            type: 'demande-de-modification',
            date,
            authority,
            modificationType,
            status,
            role,
            responseUrl,
            detailsUrl,
          };
      }
    });

  return propsArray;
};

const isModificationRequestEvent = or(
  is('ModificationRequested'),
  is('ModificationRequestRejected'),
  is('ModificationRequestInstructionStarted'),
  is('ModificationRequestAccepted'),
  is('ModificationRequestCancelled'),
);

const getEventsGroupedByModificationRequestId = (
  modificationRequestedEvents: ModificationRequestDTO[],
) => {
  return modificationRequestedEvents.reduce((modificationRequests, event) => {
    if (modificationRequests[event.modificationRequestId]) {
      modificationRequests[event.modificationRequestId].push(event);
    } else {
      modificationRequests[event.modificationRequestId] = [event];
    }
    return modificationRequests;
  }, {} as Record<string, ModificationRequestDTO[]>);
};

const getLatestEvent = (events: ModificationRequestDTO[]) => {
  const sortedEvents = events.sort((a, b) => a.date - b.date);
  return sortedEvents[sortedEvents.length - 1];
};

const getRequestEvent = (events: ModificationRequestDTO[]) => {
  return events.filter(is('ModificationRequested'))[0];
};

const getResponseUrl = (latestEvent: ModificationRequestDTO) => {
  if (
    !['porteur-projet', 'dreal', 'admin', 'dgec-validateur', 'cre', 'acheteur-obligé'].includes(
      latestEvent.variant,
    )
  ) {
    return;
  }
  if (
    or(is('ModificationRequestRejected'), is('ModificationRequestAccepted'))(latestEvent) &&
    latestEvent.file?.name
  ) {
    return makeDocumentUrl(latestEvent.file.id, latestEvent.file.name);
  } else {
    return;
  }
};

function getStatus(event: ModificationRequestDTO) {
  switch (event.type) {
    case 'ModificationRequested':
      return 'envoyée';
    case 'ModificationRequestInstructionStarted':
      return 'en instruction';
    case 'ModificationRequestAccepted':
      return 'acceptée';
    case 'ModificationRequestRejected':
      return 'rejetée';
    case 'ModificationRequestCancelled':
      return 'annulée';
  }
}
