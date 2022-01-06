import React, { useState } from 'react'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from './components'
import { GFForm } from '.'
import { WarningItem } from './components/WarningItem'
import { UserRole } from '../../../../../modules/users'

type GarantieFinanciereItemProps = {
  isLastItem: boolean
  groupIndex: number
  userRole: UserRole
  projectId: string
  date: number
  dueDate?: number
  deadlineHaspassed?: boolean
  documentLink?: string
}

export const GarantieFinanciereItem = ({
  isLastItem,
  groupIndex,
  userRole,
  projectId,
  date,
  dueDate,
  deadlineHaspassed,
  documentLink,
}: GarantieFinanciereItemProps) => {
  const [isFormVisible, showForm] = useState(false)
  const isPorteurProjet = userRole === 'porteur-projet'
  const displayWarning = deadlineHaspassed && isPorteurProjet

  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      {dueDate ? <CurrentIcon /> : <PastIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {dueDate && (
          <div>
            <div className="flex">
              <p className="mt-0 mb-0">Garanties financières en attente</p>
              {displayWarning && <WarningItem message="date dépassée" />}
            </div>
            {isPorteurProjet && (
              <>
                <a onClick={() => showForm(!isFormVisible)}>Transmettre l'attestation</a>
                {isFormVisible && (
                  <GFForm projectId={projectId} onCancel={() => showForm(!isFormVisible)} />
                )}
              </>
            )}
          </div>
        )}
        {documentLink && (
          <a href={documentLink} download>
            Télécharger l'attestation de garanties financières
          </a>
        )}
      </ContentArea>
    </TimelineItem>
  )
}
