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
  AttestationConformiteItem,
  AttestationConformiteItemProps,
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
  shouldDisplayAttestationConformité: boolean;
  attestationConformité?: AttestationConformiteItemProps['attestationConformité'];
  identifiantProjet: string;
};

type ItemProps =
  | ImportItemProps
  | DesignationItemProps
  // | AttestationConformiteItemProps
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
    project: { id: projectId, status },
  },
  identifiantProjet,
  shouldDisplayAttestationConformité,
  attestationConformité,
}: TimelineProps) => {
  const itemProps: ItemProps[] = [
    extractDesignationItemProps(events, projectId, status),
    extractImportItemProps(events),
    // extractAttestationConformiteItemProps(events, { status }),
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
            isLastItem={
              !shouldDisplayAttestationConformité ? groupIndex === timelineItems.length - 1 : false
            }
          >
            {component}
          </TimelineItem>
        ))}
        {shouldDisplayAttestationConformité && (
          <TimelineItem isLastItem={true}>
            <AttestationConformiteItem
              attestationConformité={attestationConformité}
              identifiantProjet={identifiantProjet}
            />
          </TimelineItem>
        )}
      </ol>
    </aside>
  );
};

function isNotNil<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null && arg !== undefined;
}
