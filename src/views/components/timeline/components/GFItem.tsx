import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import ROUTES from '../../../../routes'
import { InfoItem } from './InfoItem'
import { WarningItem } from './WarningItem'
import { GFItemProps } from '../helpers/extractGFItemProps'
import { WarningIcon } from './WarningIcon'
import { ProjectStatus } from '@modules/frise'
import { formatDate } from '../../../../helpers/formatDate'
import { format } from 'date-fns'
import { Input } from '../../inputs'
import { Button } from '../../buttons'

type ComponentProps = GFItemProps & {
  project: { id: string; status: ProjectStatus }
}
export const GFItem = (props: ComponentProps) => {
  const { status, project } = props

  switch (status) {
    case 'pending-validation':
      return <Submitted {...{ ...props, status, project }} />

    case 'validated':
      return <Validated {...{ ...props, status, project }} />

    case 'due':
    case 'past-due':
      return <NotSubmitted {...{ ...props, project }} />

    case 'submitted-with-application':
      return <NotUploaded {...{ ...props, project }} />

    case 'uploaded':
      return <Uploaded {...{ ...props, project, status }} />
  }
}

/* CRE4 */

type NotSubmittedProps = ComponentProps & { status: 'due' | 'past-due' }
const NotSubmitted = ({ date, status, role, project }: NotSubmittedProps) => {
  const isPorteurProjet = role === 'porteur-projet'
  const displayWarning = status === 'past-due' && isPorteurProjet
  const isDreal = role === 'dreal'
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
          {isPorteurProjet && <SubmitForm projectId={project.id} />}
          {isDreal && <UploadForm projectId={project.id} role={role} />}
        </div>
      </ContentArea>
    </>
  )
}

type SubmittedProps = ComponentProps & { status: 'pending-validation' }
const Submitted = ({ date, url, role, project, expirationDate }: SubmittedProps) => {
  const isPorteurProjet = role === 'porteur-projet'
  const canAddExpDate = role === 'porteur-projet' || role === 'dreal'

  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
          <div className="align-middle mb-1">
            <InfoItem message={role === 'dreal' ? 'à traiter' : 'validation en attente'} />
          </div>
        </div>
        <ItemTitle title={'Constitution des garanties financières'} />
        {expirationDate ? (
          <p className="m-0">Date d'échéance : {formatDate(expirationDate)}</p>
        ) : (
          canAddExpDate && <AddExpirationDateForm projectId={project.id} />
        )}
        <div className="flex">
          {url ? (
            <a href={url} download>
              Télécharger l'attestation de garanties financières
            </a>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {isPorteurProjet && <CancelDeposit projectId={project.id} />}
      </ContentArea>
    </>
  )
}

type ValidatedProps = ComponentProps & { status: 'validated' }
const Validated = ({ date, url, expirationDate, role, project }: ValidatedProps) => {
  const canAddExpDate = role === 'porteur-projet' || role === 'dreal'

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
        {expirationDate ? (
          <p className="m-0">Date d'échéance : {formatDate(expirationDate)}</p>
        ) : (
          canAddExpDate && <AddExpirationDateForm projectId={project.id} />
        )}
        <div>
          {url ? (
            <>
              <a href={url} download>
                Télécharger l'attestation de garanties financières
              </a>
              <span>&nbsp;(validée)</span>
            </>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
      </ContentArea>
    </>
  )
}

type SubmitFormProps = {
  projectId: string
}
const SubmitForm = ({ projectId }: SubmitFormProps) => {
  const [isFormVisible, showForm] = useState(false)

  return (
    <>
      <a onClick={() => showForm(!isFormVisible)}>Transmettre l'attestation</a>
      {isFormVisible && (
        <form
          action={ROUTES.SUBMIT_GARANTIES_FINANCIERES({ projectId })}
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
        >
          <input type="hidden" name="type" id="type" value="garanties-financieres" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="stepDate">Date de constitution</label>
            <Input
              type="date"
              name="stepDate"
              id="stepDate"
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
          <div>
            <label htmlFor="expirationDate">Date d'échéance de la garantie*</label>
            <Input type="date" name="expirationDate" id="expirationDate" required />
          </div>
          <div>
            <label htmlFor="file">Attestation</label>
            <Input type="file" name="file" id="file" required />
          </div>
          <p className="m-0 mt-3 italic">
            *La garantie doit avoir une durée couvrant le projet jusqu’à 6 mois après la date
            d’Achèvement de l’installation ou être renouvelée régulièrement afin d’assurer une telle
            couverture temporelle.
          </p>
          <div className="flex gap-4 flex-col md:flex-row">
            <Button type="submit" primary>
              Enregistrer
            </Button>
            <Button onClick={() => showForm(false)}>Annuler</Button>
          </div>
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
    href={ROUTES.REMOVE_GARANTIES_FINANCIERES({
      projectId,
    })}
    data-confirm="Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?"
  >
    Annuler le dépôt
  </a>
)

/* PPE2 */

type NotUploadedProps = ComponentProps

const NotUploaded = ({ role, project }: NotUploadedProps) => {
  const hasRightsToUpload = role === 'porteur-projet' || role === 'dreal'
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <ItemTitle title={'Constitution des garanties financières'} />
        <span>Attestation de constitution des garanties financières soumise à la candidature</span>
        {hasRightsToUpload && <UploadForm projectId={project.id} role={role} />}
      </ContentArea>
    </>
  )
}

type UploadedProps = ComponentProps & { status: 'uploaded' }

const Uploaded = ({ date, url, role, project, expirationDate, uploadedByRole }: UploadedProps) => {
  const canUpdateGF = role === 'porteur-projet' || role === 'dreal'

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
        {expirationDate ? (
          <p className="m-0">Date d'échéance : {formatDate(expirationDate)}</p>
        ) : (
          canUpdateGF && <AddExpirationDateForm projectId={project.id} />
        )}
        <div className="flex">
          {url ? (
            <a href={url} download>
              Télécharger l'attestation de garanties financières
            </a>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {canUpdateGF && <WithdrawDocument projectId={project.id} uploadedByRole={uploadedByRole} />}
        {uploadedByRole === 'dreal' && (
          <p className="m-0 italic">Ce document a été ajouté par la DREAL</p>
        )}
      </ContentArea>
    </>
  )
}

type UploadFormProps = {
  projectId: string
  role: 'porteur-projet' | 'dreal'
}
const UploadForm = ({ projectId, role }: UploadFormProps) => {
  const [isFormVisible, showForm] = useState(false)
  const isPorteur = role === 'porteur-projet'

  return (
    <>
      <a onClick={() => showForm(!isFormVisible)}>Enregistrer l'attestation dans Potentiel</a>
      {isFormVisible && (
        <form
          action={ROUTES.UPLOAD_GARANTIES_FINANCIERES({ projectId })}
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
        >
          <input type="hidden" name="type" id="type" value="garanties-financieres" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="stepDate">Date de constitution</label>
            <Input
              type="date"
              name="stepDate"
              id="stepDate"
              required
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          <div>
            <label htmlFor="expirationDate">Date d'échéance de la garantie*</label>
            <Input type="date" name="expirationDate" id="expirationDate" required />
          </div>
          <div>
            <label htmlFor="file">Attestation{isPorteur && <span>**</span>}</label>
            <Input type="file" name="file" id="file" required />
            <p className="m-0 mt-3 italic">
              *La garantie doit avoir une durée couvrant le projet jusqu’à 6 mois après la date
              d’Achèvement de l’installation ou être renouvelée régulièrement afin d’assurer une
              telle couverture temporelle.
            </p>
            {isPorteur && (
              <p className="m-0 mt-3 italic">
                **Il s'agit de l'attestation soumise à la candidature. Cet envoi ne fera pas l'objet
                d'une nouvelle validation.
              </p>
            )}
          </div>
          <div className="flex gap-4 flex-col md:flex-row">
            <Button type="submit" primary>
              Enregistrer
            </Button>
            <Button onClick={() => showForm(false)}>Annuler</Button>
          </div>
        </form>
      )}
    </>
  )
}

type WithdrawDocumentProps = {
  projectId: string
  uploadedByRole: 'porteur-projet' | 'dreal'
}
const WithdrawDocument = ({ projectId, uploadedByRole }: WithdrawDocumentProps) => (
  <p className="p-0 m-0">
    <a
      href={ROUTES.WITHDRAW_GARANTIES_FINANCIERES({
        projectId,
      })}
      data-confirm="Êtes-vous sur de vouloir retirer l'attestion jointe ?"
    >
      Retirer le document de Potentiel
    </a>
    {uploadedByRole === 'porteur-projet' && (
      <span> (cela n'annule pas les garanties financières soumises à la candidature)</span>
    )}
  </p>
)

type AddExpirationDateFormProps = {
  projectId: string
}
const AddExpirationDateForm = ({ projectId }: AddExpirationDateFormProps) => {
  const [isFormVisible, showForm] = useState(false)
  return (
    <>
      <a onClick={() => showForm(!isFormVisible)}>Renseigner la date d'échéance</a>
      {isFormVisible && (
        <form
          action=""
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <label htmlFor="expirationDate">Date d'échéance des garanties financières*</label>
          <Input type="date" name="date" id="date" />
          <p className="italic">
            *A noter : la garantie doit avoir une durée couvrant le projet jusqu’à 6 mois après la
            date d’Achèvement de l’installation ou être renouvelée régulièrement afin d’assurer une
            telle couverture temporelle.
          </p>
          <div className="flex gap-4 flex-col md:flex-row">
            <Button type="submit" primary>
              Enregistrer
            </Button>
            <Button onClick={() => showForm(false)}>Annuler</Button>
          </div>
        </form>
      )}
    </>
  )
}
