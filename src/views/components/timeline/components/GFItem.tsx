import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import ROUTES from '../../../../routes'
import { DateInput } from '../..'
import { WarningItem } from './WarningItem'
import { GFItemProps } from '../helpers/extractGFItemProps'
import { WarningIcon } from './WarningIcon'

export const GFItem = ({
  role,
  projectId,
  date,
  status,
  url,
  validationStatus,
}: GFItemProps & { projectId: string }) => {
  const isPorteurProjet = role === 'porteur-projet'
  const displayWarning = status === 'past-due' && isPorteurProjet
  const isSubmitted = status === 'submitted'
  const isValidated = validationStatus === 'validée'

  return (
    <>
      {isSubmitted ? <PastIcon /> : displayWarning ? <WarningIcon /> : <CurrentIcon />}
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
          {displayWarning && (
            <div className="align-middle mb-1">
              <WarningItem message="date dépassée" />
            </div>
          )}
        </div>
        <ItemTitle title={'Constitution des garanties Financières'} />
        {!isSubmitted ? (
          <div>
            <div className="flex">
              <p className="mt-0 mb-0">Garanties financières en attente</p>
            </div>
            {isPorteurProjet && <UploadForm projectId={projectId} />}
          </div>
        ) : (
          <>
            <div>
              {url ? (
                <a href={url} download>
                  Télécharger l'attestation de garanties financières
                </a>
              ) : (
                <span>Attestation indisponible actuellement</span>
              )}
              <span>&nbsp;({validationStatus})</span>
            </div>
            {isPorteurProjet && !isValidated && <RemoveDocument projectId={projectId} />}
          </>
        )}
      </ContentArea>
    </>
  )
}

interface UploadFormProps {
  projectId: string
}

const UploadForm = ({ projectId }: UploadFormProps) => {
  const [isFormVisible, showForm] = useState(false)

  const [disableSubmit, setDisableSubmit] = useState(true)

  return (
    <>
      <a onClick={() => showForm(!isFormVisible)}>Transmettre l'attestation</a>
      {isFormVisible && (
        <form
          action={ROUTES.DEPOSER_ETAPE_ACTION}
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5"
        >
          <input type="hidden" name="type" id="type" value="garantie-financiere" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="date">Date de constitution (format JJ/MM/AAAA)</label>
            <DateInput onError={(isError) => setDisableSubmit(isError)} />
          </div>
          <div className="mt-2">
            <label htmlFor="file">Attestation</label>
            <input type="file" name="file" id="file" required />
          </div>
          <button className="button" type="submit" name="submit" disabled={disableSubmit}>
            Envoyer
          </button>
          <a onClick={() => showForm(false)}>Annuler</a>
        </form>
      )}
    </>
  )
}

interface RemoveDocumentProps {
  projectId: string
}

const RemoveDocument = ({ projectId }: RemoveDocumentProps) => {
  return (
    <a
      href={ROUTES.SUPPRIMER_ETAPE_ACTION({
        projectId,
        type: 'garantie-financiere',
      })}
      data-confirm="Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?"
    >
      Annuler le dépôt
    </a>
  )
}
