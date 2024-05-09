import React from 'react';
import {
  CahierDesChargesChoisiDTO,
  DemandeAbandonSignaledDTO,
  DemandeDelaiSignaledDTO,
  DemandeDélaiDTO,
  DemandeRecoursSignaledDTO,
  ProjectEventListDTO,
  is,
} from '../../../modules/frise';
import {
  AttachedFileItem,
  CahierDesChargesChoisiItem,
  DemandeDelaiSignaledItem,
  DemandeDélaiItem,
  DemandeRecoursSignaledItem,
  DesignationItem,
  ImportItem,
  LegacyModificationsItem,
  ModificationReceivedItem,
  ModificationRequestItem,
  TimelineItem,
} from './components';
import {
  AttachedFileItemProps,
  DesignationItemProps,
  ImportItemProps,
  LegacyModificationsItemProps,
  ModificationReceivedItemProps,
  ModificationRequestItemProps,
  extractAttachedFileItemProps,
  extractDesignationItemProps,
  extractImportItemProps,
  extractLegacyModificationsItemProps,
  extractModificationReceivedItemProps,
  extractModificationRequestsItemProps,
} from './helpers';

export type TimelineProps = {
  projectEventList: ProjectEventListDTO;
};

type ItemProps =
  | ImportItemProps
  | DesignationItemProps
  | ModificationRequestItemProps
  | ModificationReceivedItemProps
  | LegacyModificationsItemProps
  | AttachedFileItemProps
  | DemandeDelaiSignaledDTO
  | DemandeAbandonSignaledDTO
  | DemandeRecoursSignaledDTO
  | DemandeDélaiDTO
  | CahierDesChargesChoisiDTO;

export const Timeline = ({
  projectEventList: {
    events,
    project: { id: projectId, status, garantieFinanciereEnMois, nomProjet },
  },
}: TimelineProps) => {
  const itemProps: ItemProps[] = [
    extractDesignationItemProps(events, projectId, status),
    extractImportItemProps(events),
    ...extractModificationRequestsItemProps(events),
    ...events.filter(is('DemandeDelaiSignaled')),
    ...events.filter(is('DemandeAbandonSignaled')),
    ...events.filter(is('DemandeRecoursSignaled')),
    ...extractModificationReceivedItemProps(events),
    ...extractLegacyModificationsItemProps(events),
    ...extractAttachedFileItemProps(events),
    ...events.filter(is('DemandeDélai')),
    ...events.filter(is('CahierDesChargesChoisi')),
  ]
    .filter(isNotNil)
    .sort((a, b) => a.date - b.date);

  const timelineItems = itemProps.map((props) => {
    const { type } = props;

    switch (type) {
      case 'designation':
        return <DesignationItem {...props} />;

      case 'import':
        return <ImportItem {...props} />;

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

      case 'DemandeRecoursSignaled':
        return <DemandeRecoursSignaledItem {...props} />;

      case 'DemandeDélai':
        return <DemandeDélaiItem {...props} />;

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
