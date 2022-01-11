import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '../components'
import { GFForm } from './GFForm'
import { WarningItem } from '../components/WarningItem'
import { GarantieFinanciereItemProps } from '../helpers/extractGFItemProps'

export const GarantieFinanciereItem = ({
  role,
  projectId,
  date,
  status,
  url,
}: GarantieFinanciereItemProps & { projectId: string }) => {
  const [isFormVisible, showForm] = useState(false)
  const isPorteurProjet = role === 'porteur-projet'
  const displayWarning = status === 'past-due' && isPorteurProjet

  return (
    <>
      {status === 'submitted' ? <PastIcon /> : <CurrentIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Constitution des garanties Financières" />
        {status !== 'submitted' ? (
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
        ) : (
          <a href={url} download>
            Télécharger l'attestation de garanties financières
          </a>
        )}
      </ContentArea>
    </>
  )
}
