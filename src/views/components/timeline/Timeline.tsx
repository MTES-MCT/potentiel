import React from 'react';
import {
  DemandeDelaiSignaledDTO,
  DemandeAbandonSignaledDTO,
  DemandeRecoursSignaledDTO,
  is,
  ProjectEventListDTO,
  DemandeDélaiDTO,
  DemandeAbandonDTO,
  CahierDesChargesChoisiDTO,
  DemandeAnnulationAbandonDTO,
} from '@modules/frise';
import {
  TimelineItem,
  DesignationItem,
  ImportItem,
  ACItem,
  CAItem,
  ModificationRequestItem,
  ModificationReceivedItem,
  AttachedFileItem,
  LegacyModificationsItem,
  DemandeDélaiItem,
  DemandeAbandonSignaledItem,
  DemandeRecoursSignaledItem,
  DemandeDelaiSignaledItem,
  DemandeAbandonItem,
  CahierDesChargesChoisiItem,
} from './components';
import {
  ACItemProps,
  CAItemProps,
  DesignationItemProps,
  extractACItemProps,
  extractCAItemProps,
  extractDesignationItemProps,
  extractImportItemProps,
  ImportItemProps,
  extractModificationRequestsItemProps,
  ModificationRequestItemProps,
  ModificationReceivedItemProps,
  extractModificationReceivedItemProps,
  extractLegacyModificationsItemProps,
  LegacyModificationsItemProps,
  AttachedFileItemProps,
  extractAttachedFileItemProps,
} from './helpers';
import { DemandeAnnulationAbandonItem } from './components/DemandeAnnulationAbandonItem';

export type TimelineProps = {
  projectEventList: ProjectEventListDTO;
};

type ItemProps =
  | ImportItemProps
  | DesignationItemProps
  | ACItemProps
  | CAItemProps
  | ModificationRequestItemProps
  | ModificationReceivedItemProps
  | LegacyModificationsItemProps
  | AttachedFileItemProps
  | DemandeDelaiSignaledDTO
  | DemandeAbandonSignaledDTO
  | DemandeRecoursSignaledDTO
  | DemandeDélaiDTO
  | DemandeAbandonDTO
  | DemandeAnnulationAbandonDTO
  | CahierDesChargesChoisiDTO;

export const Timeline = ({
  projectEventList: {
    events,
    project: { id: projectId, status, nomProjet },
  },
}: TimelineProps) => {
  const itemProps: ItemProps[] = [
    extractDesignationItemProps(events, projectId, status),
    extractImportItemProps(events),
    extractACItemProps(events, { status }),
    ...extractModificationRequestsItemProps(events),
    ...events.filter(is('DemandeDelaiSignaled')),
    ...events.filter(is('DemandeAbandonSignaled')),
    ...events.filter(is('DemandeRecoursSignaled')),
    ...extractModificationReceivedItemProps(events),
    ...extractLegacyModificationsItemProps(events),
    ...extractAttachedFileItemProps(events),
    ...events.filter(is('DemandeDélai')),
    ...events.filter(is('DemandeAbandon')),
    ...events.filter(is('DemandeAnnulationAbandon')),
    ...events.filter(is('CahierDesChargesChoisi')),
  ]
    .filter(isNotNil)
    .sort((a, b) => a.date - b.date);

  insertAfter(itemProps, 'attestation-de-conformite', extractCAItemProps(events, { status }));

  const timelineItems = itemProps.map((props) => {
    const { type } = props;

    switch (type) {
      case 'designation':
        return <DesignationItem {...props} />;

      case 'import':
        return <ImportItem {...props} />;

      case 'attestation-de-conformite':
        return <ACItem {...props} />;

      case 'contrat-achat':
        return <CAItem />;

      case 'demande-de-modification':
        return <ModificationRequestItem {...{ ...props, projectStatus: status }} />;

      case 'modification-information':
        return <ModificationReceivedItem {...props} />;

      case 'modification-historique':
        return <LegacyModificationsItem {...props} />;

      case 'fichier-attaché':
        return <AttachedFileItem {...props} />;

      case 'DemandeDelaiSignaled':
        return <DemandeDelaiSignaledItem {...props} />;

      case 'DemandeAbandonSignaled':
        return <DemandeAbandonSignaledItem {...props} />;

      case 'DemandeRecoursSignaled':
        return <DemandeRecoursSignaledItem {...props} />;

      case 'DemandeDélai':
        return <DemandeDélaiItem {...props} />;

      case 'DemandeAbandon':
        return <DemandeAbandonItem {...props} />;

      case 'DemandeAnnulationAbandon':
        return <DemandeAnnulationAbandonItem {...props} />;

      case 'CahierDesChargesChoisi':
        return <CahierDesChargesChoisiItem {...props} />;
    }
  });

  return (
    <aside aria-label="Progress">
      <ol className="pl-0 overflow-hidden list-none">
        {timelineItems.map((component, groupIndex) => (
          <TimelineItem
            key={`project-timeline-item-${groupIndex}`}
            isLastItem={groupIndex === timelineItems.length - 1}
          >
            {component}
          </TimelineItem>
        ))}
      </ol>
    </aside>
  );
};

function isNotNil<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null && arg !== undefined;
}

function insertAfter(
  itemProps: ItemProps[],
  referenceType: ItemProps['type'],
  item: ItemProps | null,
) {
  if (itemProps.findIndex((props) => props.type === referenceType) !== -1) {
    if (item) {
      itemProps.splice(itemProps.findIndex((props) => props.type === referenceType) + 1, 0, item);
    }
  }
}
