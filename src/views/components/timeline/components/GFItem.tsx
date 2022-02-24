import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import ROUTES from '../../../../routes'
import { DateInput } from '../..'
import { InfoItem } from './InfoItem'
import { WarningItem } from './WarningItem'
import { GFItemProps } from '../helpers/extractGFItemProps'
import { WarningIcon } from './WarningIcon'

type ComponentProps = GFItemProps & { projectId: string }

export const GFItem = (props: ComponentProps) => {
  const { status, projectId } = props

  switch (status) {
    case 'pending-validation':
    case 'validated':
      return <Submitted {...{ ...props, projectId, status }} />

    case 'due':
    case 'past-due':
      return <NotSubmitted {...{ ...props, projectId }} />

    case 'submitted-with-application':
      return <NotUploaded {...{ ...props, projectId }} />

    case 'uploaded':
      return <Uploaded {...{ ...props, projectId, status }} />
  }
}

/* CRE4 */

type NotSubmittedProps = ComponentProps & { status: 'due' | 'past-due' }
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

type SubmittedProps = ComponentProps & { status: 'pending-validation' | 'validated' }
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

type CancelDepositProps = {
  projectId: ComponentProps['projectId']
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

/* PPE2 */

type NotUploadedProps = ComponentProps & { status: 'submitted-with-application' }

const NotUploaded = ({ role, projectId, status }: NotUploadedProps) => {
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

type UploadedProps = ComponentProps & { status: 'uploaded' }

const Uploaded = ({ date, url, role, projectId }: UploadedProps) => {
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
        {isPorteurProjet && <WithdrawDocument projectId={projectId} />}
      </ContentArea>
    </>
  )
}

type WithdrawDocumentProps = {
  projectId: ComponentProps['projectId']
}
const WithdrawDocument = ({ projectId }: WithdrawDocumentProps) => (
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

/* shared component */

type UploadFormProps = {
  projectId: ComponentProps['projectId']
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
            <label htmlFor="file">
              Attestation{status === 'submitted-with-application' && <span>*</span>}
            </label>
            <input type="file" name="file" id="file" required />
            {status === 'submitted-with-application' && (
              <p className="m-0 italic">
                *Il s'agit de l'attestation soumise à la candidature. Cet envoi ne fera pas l'objet
                d'une nouvelle validation.
              </p>
            )}
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
