import React from 'react';
import {
  CahierDesChargesChoisiDTO,
  DemandeAbandonSignaledDTO,
  DemandeDelaiSignaledDTO,
  DemandeDélaiDTO,
  ProjectEventListDTO,
  AchèvementRéelDTO,
  is,
} from '../../../modules/frise';
import {
  AchèvementPrévisionnelItem,
  AchèvementRéelItem,
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
  AchèvementPrévisionnelItemProps,
  AttachedFileItemProps,
  DesignationItemProps,
  ImportItemProps,
  LegacyModificationsItemProps,
  ModificationReceivedItemProps,
  ModificationRequestItemProps,
  extractAchèvementPrévisionnelItemProps,
  extractAttachedFileItemProps,
  extractDesignationItemProps,
  extractImportItemProps,
  extractLegacyModificationsItemProps,
  extractModificationReceivedItemProps,
  extractModificationRequestsItemProps,
} from './helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type TimelineProps = {
  projectEventList: ProjectEventListDTO;
  identifiantProjet: IdentifiantProjet.RawType;
};

type ItemProps =
  | ImportItemProps
  | DesignationItemProps
  | AchèvementPrévisionnelItemProps
  | ModificationRequestItemProps
  | ModificationReceivedItemProps
  | LegacyModificationsItemProps
  | AttachedFileItemProps
  | DemandeDelaiSignaledDTO
  | DemandeAbandonSignaledDTO
  | DemandeDélaiDTO
  | CahierDesChargesChoisiDTO
  | AchèvementRéelDTO;

export const Timeline = ({
  projectEventList: {
    events,
    project: { status },
  },
  identifiantProjet,
}: TimelineProps) => {
  const itemProps: ItemProps[] = [
    extractDesignationItemProps(events, status, identifiantProjet),
    extractImportItemProps(events),
    extractAchèvementPrévisionnelItemProps(events, { status }),
    ...extractModificationRequestsItemProps(events),
    ...events.filter(is('DemandeDelaiSignaled')),
    ...events.filter(is('DemandeAbandonSignaled')),
    ...extractModificationReceivedItemProps(events),
    ...extractLegacyModificationsItemProps(events),
    ...extractAttachedFileItemProps(events),
    ...events.filter(is('DemandeDélai')),
    ...events.filter(is('CahierDesChargesChoisi')),
    ...events.filter(is('achevement-reel')),
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

      case 'achevement-previsionnel':
        return <AchèvementPrévisionnelItem {...props} />;

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

      case 'DemandeDélai':
        return <DemandeDélaiItem {...props} />;

      case 'CahierDesChargesChoisi':
        return <CahierDesChargesChoisiItem {...props} />;

      case 'achevement-reel':
        return <AchèvementRéelItem {...props} />;
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
