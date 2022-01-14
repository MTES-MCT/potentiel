import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import ROUTES from '../../../../routes'
import { DateInput } from '../..'
import { PTFItemProps } from '../helpers/extractPTFItemProps'

export const PTFItem = ({
  role,
  projectId,
  date,
  status,
  url,
}: PTFItemProps & { projectId: string }) => {
  const isPorteurProjet = role === 'porteur-projet'

  return (
    <>
      {status === 'submitted' ? <PastIcon /> : <CurrentIcon />}
      <ContentArea>
        <div className="flex">
          {date && (
            <div className="align-middle">
              <ItemDate date={date} />
            </div>
          )}
        </div>
        <ItemTitle title="Proposition technique et financière" />
        {status !== 'submitted' ? (
          <div>
            <div className="flex">
              <p className="mt-0 mb-0">Proposition technique et financière en attente</p>
            </div>
            {isPorteurProjet && <UploadForm projectId={projectId} />}
          </div>
        ) : (
          <>
            <div className="flex">
              <a href={url} download>
                Télécharger la proposition technique et financière
              </a>
            </div>
            {isPorteurProjet && (
              <div className="flex">
                <CancelDeposit {...{ projectId }} />
              </div>
            )}
          </>
        )}
      </ContentArea>
    </>
  )
}

type CancelDepositProps = { projectId: string }
const CancelDeposit = ({ projectId }: CancelDepositProps) => {
  return (
    <a
      href={ROUTES.SUPPRIMER_ETAPE_ACTION({ projectId, type: 'ptf' })}
      onClick={(event) =>
        confirm(`Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?`) ||
        event.preventDefault()
      }
    >
      Annuler le dépôt
    </a>
  )
}

type UploadFormProps = {
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
          <input type="hidden" name="type" id="type" value="ptf" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="date">Date de la demande (format JJ/MM/AAAA)</label>
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
