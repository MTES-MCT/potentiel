import React from 'react'
import {
  DemandeDelaiSignaledDTO,
  DemandeAbandonSignaledDTO,
  DemandeRecoursSignaledDTO,
  is,
  ProjectEventListDTO,
  DemandeDélaiDTO,
  DemandeAbandonDTO,
  CahierDesChargesChoisiDTO,
  GarantiesFinancièresDTO,
  DateMiseEnServiceDTO,
} from '@modules/frise'
import {
  TimelineItem,
  DesignationItem,
  GFItem,
  ImportItem,
  PTFItem,
  DCRItem,
  ACItem,
  CAItem,
  CRItem,
  MeSItem,
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
} from './components'
import {
  ACItemProps,
  CAItemProps,
  CRItemProps,
  DCRItemProps,
  DesignationItemProps,
  extractACItemProps,
  extractCAItemProps,
  extractCRItemProps,
  extractDCRItemProps,
  extractDesignationItemProps,
  extractImportItemProps,
  extractPTFItemProps,
  ImportItemProps,
  MeSItemProps,
  PTFItemProps,
  extractModificationRequestsItemProps,
  ModificationRequestItemProps,
  ModificationReceivedItemProps,
  extractModificationReceivedItemProps,
  extractLegacyModificationsItemProps,
  LegacyModificationsItemProps,
  AttachedFileItemProps,
  extractAttachedFileItemProps,
} from './helpers'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  now: number
}

type ItemProps =
  | ImportItemProps
  | DesignationItemProps
  | DCRItemProps
  | ACItemProps
  | PTFItemProps
  | CRItemProps
  | MeSItemProps
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
  | CahierDesChargesChoisiDTO
  | GarantiesFinancièresDTO
  | DateMiseEnServiceDTO

export const Timeline = ({
  projectEventList: {
    events,
    project: { id: projectId, status, garantieFinanciereEnMois },
  },
  now,
}: TimelineProps) => {
  const PTFItemProps = extractPTFItemProps(events, { status })
  const garantiesFinancières = events.find(is('garanties-financieres'))
  const dateMiseEnService = events.find(is('DateMiseEnService'))

  const itemProps: ItemProps[] = [
    extractDesignationItemProps(events, projectId, status),
    extractImportItemProps(events),
    garantiesFinancières?.statut !== 'submitted-with-application'
      ? garantiesFinancières
      : undefined,
    extractDCRItemProps(events, now, { status }),
    extractACItemProps(events, { status }),
    PTFItemProps?.status === 'submitted' ? PTFItemProps : undefined,
    ...extractModificationRequestsItemProps(events),
    ...events.filter(is('DemandeDelaiSignaled')),
    ...events.filter(is('DemandeAbandonSignaled')),
    ...events.filter(is('DemandeRecoursSignaled')),
    ...extractModificationReceivedItemProps(events),
    ...extractLegacyModificationsItemProps(events),
    ...extractAttachedFileItemProps(events),
    ...events.filter(is('DemandeDélai')),
    ...events.filter(is('DemandeAbandon')),
    ...events.filter(is('CahierDesChargesChoisi')),
    dateMiseEnService?.statut === 'renseignée' ? dateMiseEnService : undefined,
  ]
    .filter(isNotNil)
    .sort((a, b) => a.date - b.date)

  PTFItemProps?.status === 'not-submitted' &&
    insertBefore(itemProps, 'attestation-de-conformite', PTFItemProps)
  insertBefore(itemProps, 'attestation-de-conformite', extractCRItemProps(events, { status }))
  insertAfter(itemProps, 'attestation-de-conformite', extractCAItemProps(events, { status }))
  dateMiseEnService?.statut === 'non-renseignée' &&
    insertAfter(itemProps, 'attestation-de-conformite', dateMiseEnService)
  garantiesFinancières?.statut === 'submitted-with-application' &&
    insertAfter(itemProps, 'designation', garantiesFinancières)

  const timelineItems = itemProps.map((props) => {
    const { type } = props

    switch (type) {
      case 'designation':
        return <DesignationItem {...props} />

      case 'import':
        return <ImportItem {...props} />

      case 'garanties-financieres':
        return (
          <GFItem
            {...{
              project: { id: projectId, status, garantieFinanciereEnMois },
              ...props,
            }}
          />
        )

      case 'demande-complete-de-raccordement':
        return <DCRItem {...{ ...props, projectId }} />

      case 'proposition-technique-et-financiere':
        return <PTFItem {...{ ...props, projectId }} />

      case 'convention-de-raccordement':
        return <CRItem />

      case 'attestation-de-conformite':
        return <ACItem {...props} />

      case 'DateMiseEnService':
        return <MeSItem {...props} />

      case 'contrat-achat':
        return <CAItem />

      case 'demande-de-modification':
        return <ModificationRequestItem {...{ ...props, projectStatus: status }} />

      case 'modification-information':
        return <ModificationReceivedItem {...props} />

      case 'modification-historique':
        return <LegacyModificationsItem {...props} />

      case 'fichier-attaché':
        return <AttachedFileItem {...props} />

      case 'DemandeDelaiSignaled':
        return <DemandeDelaiSignaledItem {...props} />

      case 'DemandeAbandonSignaled':
        return <DemandeAbandonSignaledItem {...props} />

      case 'DemandeRecoursSignaled':
        return <DemandeRecoursSignaledItem {...props} />

      case 'DemandeDélai':
        return <DemandeDélaiItem {...props} />

      case 'DemandeAbandon':
        return <DemandeAbandonItem {...props} />

      case 'CahierDesChargesChoisi':
        return <CahierDesChargesChoisiItem {...props} />
    }
  })

  return (
    <aside aria-label="Progress">
      <ol role="list" className="pl-0 overflow-hidden list-none">
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
  )
}

function isNotNil<T>(arg: T): arg is Exclude<T, null | undefined> {
  return arg !== null && arg !== undefined
}

function insertBefore(
  itemProps: ItemProps[],
  referenceType: ItemProps['type'],
  item: ItemProps | null
) {
  if (itemProps.findIndex((props) => props.type === referenceType) !== -1) {
    if (item) {
      itemProps.splice(
        itemProps.findIndex((props) => props.type === referenceType),
        0,
        item
      )
    }
  }
}

function insertAfter(
  itemProps: ItemProps[],
  referenceType: ItemProps['type'],
  item: ItemProps | null
) {
  if (itemProps.findIndex((props) => props.type === referenceType) !== -1) {
    if (item) {
      itemProps.splice(itemProps.findIndex((props) => props.type === referenceType) + 1, 0, item)
    }
  }
}
