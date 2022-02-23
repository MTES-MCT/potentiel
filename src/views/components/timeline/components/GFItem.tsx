import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import ROUTES from '../../../../routes'
import { DateInput } from '../..'
import { InfoItem } from './InfoItem'
import { WarningItem } from './WarningItem'
import { GFItemProps } from '../helpers/extractGFItemProps'
import { WarningIcon } from './WarningIcon'
import { UserRole } from '../../../../modules/users'

export const GFItem = (props: GFItemProps & { projectId: string }) => {
  const { status, projectId } = props

  switch (status) {
    case 'pending-validation':
    case 'validated':
      return <Submitted {...{ ...props, projectId, status }} />

    case 'due':
    case 'past-due':
      return <NotSubmitted {...{ ...props, projectId }} />

    case 'submitted-with-application':
      return <SubmittedWithApplication {...{ ...props, projectId }} />

    case 'submitted-with-application-and-uploaded':
      return <Uploaded {...{ ...props, projectId, status }} />
  }
}

type SubmittedWithApplicationProps = {
  role: UserRole
  projectId: string
  status: 'submitted-with-application'
}

const SubmittedWithApplication = ({ role, projectId, status }: SubmittedWithApplicationProps) => {
  const isPorteurProjet = role === 'porteur-projet'
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <ItemTitle title={'Constitution des garanties financières'} />
        <span>Garanties financières soumises à la candidature</span>
        {isPorteurProjet && (
          <UploadForm
            projectId={projectId}
            URLTitle="Enregistrer mon attestation dans Potentiel"
            status={status}
          />
        )}
      </ContentArea>
    </>
  )
}

type UploadedProps = {
  date: number
  status: 'submitted-with-application-and-uploaded'
  url: string | undefined
  role: UserRole
  projectId: string
}
const Uploaded = ({ date, status, url, role, projectId }: UploadedProps) => {
  const isPorteurProjet = role === 'porteur-projet'

  return (
    <>
      <PastIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
        </div>
        <ItemTitle title={'Constitution des garanties financières'} />
        <div className="flex">
          {url ? (
            <a href={url} download>
              Télécharger l'attestation de garanties financières
            </a>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {isPorteurProjet && <RemoveDocument projectId={projectId} />}
      </ContentArea>
    </>
  )
}

type SubmittedProps = {
  date: number
  status: 'pending-validation' | 'validated'
  url: string | undefined
  role: UserRole
  projectId: string
}
const Submitted = ({ date, status, url, role, projectId }: SubmittedProps) => {
  const isPorteurProjet = role === 'porteur-projet'
  const isValidated = status === 'validated'

  return (
    <>
      {isValidated ? <PastIcon /> : <CurrentIcon />}
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
          {!isValidated && (
            <div className="align-middle mb-1">
              <InfoItem message={role === 'dreal' ? 'à traiter' : 'validation en attente'} />
            </div>
          )}
        </div>
        <ItemTitle title={'Constitution des garanties financières'} />
        <div className="flex">
          {url ? (
            <a href={url} download>
              Télécharger l'attestation de garanties financières
            </a>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
          {isValidated && <span>validé</span>}
        </div>
        {isPorteurProjet && status === 'pending-validation' && (
          <CancelDeposit projectId={projectId} />
        )}
      </ContentArea>
    </>
  )
}

type NotSubmittedProps = {
  date: number
  status: 'due' | 'past-due'
  role: UserRole
  projectId: string
}
const NotSubmitted = ({ date, status, role, projectId }: NotSubmittedProps) => {
  const isPorteurProjet = role === 'porteur-projet'
  const displayWarning = status === 'past-due' && isPorteurProjet
  return (
    <>
      {displayWarning ? <WarningIcon /> : <CurrentIcon />}
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
        <ItemTitle title={'Garanties financières'} />
        <div>
          <div className="flex">
            <p className="mt-0 mb-0">
              Attestation de constitution de garanties financières en attente
            </p>
          </div>
          {isPorteurProjet && (
            <UploadForm
              projectId={projectId}
              URLTitle="Transmettre l'attestation"
              status={status}
            />
          )}
        </div>
      </ContentArea>
    </>
  )
}

type UploadFormProps = {
  projectId: string
  URLTitle: string
  status: 'submitted-with-application' | 'due' | 'past-due'
}
const UploadForm = ({ projectId, URLTitle, status }: UploadFormProps) => {
  const [isFormVisible, showForm] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(true)

  return (
    <>
      <a onClick={() => showForm(!isFormVisible)}>{URLTitle}</a>
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

type CancelDepositProps = {
  projectId: string
}
const CancelDeposit = ({ projectId }: CancelDepositProps) => (
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

type RemoveDocumentProps = {
  projectId: string
}
const RemoveDocument = ({ projectId }: RemoveDocumentProps) => (
  <p className="p-0 m-0">
    <a
      href={ROUTES.SUPPRIMER_ETAPE_ACTION({
        projectId,
        type: 'garantie-financiere',
      })}
      data-confirm="Êtes-vous sur de vouloir retirer l'attestion jointe ?"
    >
      Retirer le document de Potentiel
    </a>
    <span> (cela n'annule pas les garanties financières soumises à la candidature)</span>
  </p>
)
