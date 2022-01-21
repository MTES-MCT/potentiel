import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '../components'
import ROUTES from '../../../../routes'
import { DateInput } from '../../'
import { WarningItem } from '../components/WarningItem'
import { DCRItemProps } from '../helpers/extractDCRItemProps'
import { WarningIcon } from './WarningIcon'

export const DCRItem = (props: DCRItemProps & { projectId: string }) => {
  const { status, projectId } = props

  return status === 'submitted' ? (
    <Submitted {...{ ...props, projectId }} />
  ) : (
    <NotSubmitted {...{ ...props, projectId }} />
  )
}

type SubmittedProps = {
  role: string
  date: number
  url: string | undefined
  numeroDossier: string
  projectId: string
}

const Submitted = ({ role, date, url, numeroDossier, projectId }: SubmittedProps) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title="Demande complète de raccordement" />
        <div>
          {url ? (
            <a href={url} download>
              Télécharger la demande complète de raccordement
            </a>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
          <span>&nbsp;(dossier {numeroDossier})</span>
        </div>
        {role === 'porteur-projet' && <CancelDeposit {...{ projectId }} />}
      </ContentArea>
    </>
  )
}

type NotSubmittedProps = {
  role: string
  date: number
  projectId: string
  status: 'due' | 'past-due'
}

const NotSubmitted = ({ role, date, projectId, status }: NotSubmittedProps) => {
  return (
    <>
      {status === 'due' ? <CurrentIcon /> : <WarningIcon />}
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
          {status === 'past-due' && (
            <div className="align-middle mb-1">
              <WarningItem message="date dépassée" />
            </div>
          )}
        </div>
        <ItemTitle title="Demande complète de raccordement" />
        <div>
          <p className="mt-0 mb-0">Demande complète de raccordement en attente</p>
          {role === 'porteur-projet' && <UploadForm projectId={projectId} />}
        </div>
      </ContentArea>
    </>
  )
}

type CancelDepositProps = { projectId: string }
const CancelDeposit = ({ projectId }: CancelDepositProps) => {
  return (
    <a
      href={ROUTES.SUPPRIMER_ETAPE_ACTION({ projectId, type: 'dcr' })}
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
          <input type="hidden" name="type" id="type" value="dcr" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="date">Date de la demande (format JJ/MM/AAAA)</label>
            <DateInput onError={(isError) => setDisableSubmit(isError)} />
          </div>
          <div className="mt-2">
            <label htmlFor="numero-dossier">
              Identifiant gestionnaire de réseau (ex : GEFAR-P)
            </label>
            <input type="text" name="numeroDossier" id="numero-dossier" required />
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
