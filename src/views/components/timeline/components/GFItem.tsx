import React, { useState } from 'react'
import { ContentArea, CurrentIcon, ItemDate, ItemTitle, PastIcon } from '.'
import ROUTES from '@routes'
import { InfoItem } from './InfoItem'
import { WarningItem } from './WarningItem'
import { GFItemProps } from '../helpers'
import { WarningIcon } from './WarningIcon'
import { ProjectStatus } from '@modules/frise'
import { formatDate } from '../../../../helpers/formatDate'
import { format } from 'date-fns'
import {
  Button,
  FormulaireChampsObligatoireLégende,
  Input,
  Label,
  Astérisque,
  Link,
  Dropdown,
} from '@components'

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
const NotSubmitted = ({ date, status, role, project, nomProjet }: NotSubmittedProps) => {
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
          {isDreal && status === 'past-due' && (
            <p className="m-0">
              <Link
                href={ROUTES.TELECHARGER_MODELE_MISE_EN_DEMEURE({ id: project.id, nomProjet })}
                download
              />
            </p>
          )}
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
        <ExpirationDate
          expirationDate={expirationDate}
          projectId={project.id}
          canUpdate={canAddExpDate}
        />
        <div className="flex">
          {url ? (
            <Link href={url} download>
              Télécharger l'attestation de garanties financières
            </Link>
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
        <ExpirationDate
          expirationDate={expirationDate}
          projectId={project.id}
          canUpdate={canAddExpDate}
        />
        <div>
          {url ? (
            <>
              <Link href={url} download>
                Télécharger l'attestation de garanties financières
              </Link>
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
          <FormulaireChampsObligatoireLégende className="ml-auto" />
          <input type="hidden" name="type" id="type" value="garanties-financieres" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <Label required htmlFor="stepDate">
              Date de constitution
            </Label>
            <Input
              type="date"
              name="stepDate"
              id="stepDate"
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
          <div>
            <Label required htmlFor="expirationDate">
              Date d'échéance de la garantie
              <Astérisque className="text-black" />
            </Label>
            <Input type="date" name="expirationDate" id="expirationDate" required />
          </div>
          <div>
            <Label required htmlFor="file">
              Attestation
            </Label>
            <Input type="file" name="file" id="file" required />
          </div>
          <p className="m-0 mt-3 italic">
            <Astérisque className="text-black" /> La garantie doit avoir une durée couvrant le
            projet jusqu’à 6 mois après la date d’Achèvement de l’installation ou être renouvelée
            régulièrement afin d’assurer une telle couverture temporelle.
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
        <ExpirationDate
          expirationDate={expirationDate}
          projectId={project.id}
          canUpdate={canUpdateGF}
        />
        <div className="flex">
          {url ? (
            <Link href={url} download>
              Télécharger l'attestation de garanties financières
            </Link>
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
  const isPorteur = role === 'porteur-projet'
  const [displayForm, showForm] = useState(false)
  return (
    <Dropdown
      design="link"
      text="Enregistrer l'attestation dans Potentiel"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
    >
      <form
        action={ROUTES.UPLOAD_GARANTIES_FINANCIERES({ projectId })}
        method="post"
        encType="multipart/form-data"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <FormulaireChampsObligatoireLégende className="ml-auto" />
        <input type="hidden" name="type" id="type" value="garanties-financieres" />
        <input type="hidden" name="projectId" value={projectId} />
        <div>
          <Label required htmlFor="stepDate">
            Date de constitution
          </Label>
          <Input
            type="date"
            name="stepDate"
            id="stepDate"
            required
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
        <div>
          <Label required htmlFor="expirationDate">
            Date d'échéance de la garantie
            <Astérisque className="text-black" />
          </Label>
          <Input type="date" name="expirationDate" id="expirationDate" required />
        </div>
        <div>
          <Label required htmlFor="file">
            Attestation
            {isPorteur && (
              <span>
                <Astérisque className="text-black" />
                <Astérisque className="text-black" />
              </span>
            )}
          </Label>
          <Input type="file" name="file" id="file" required />
          <p className="m-0 mt-3 italic">
            <Astérisque className="text-black" />
            La garantie doit avoir une durée couvrant le projet jusqu’à 6 mois après la date
            d’Achèvement de l’installation ou être renouvelée régulièrement afin d’assurer une telle
            couverture temporelle.
          </p>
          {isPorteur && (
            <p className="m-0 mt-3 italic">
              <Astérisque className="text-black" />
              <Astérisque className="text-black" />
              Il s'agit de l'attestation soumise à la candidature. Cet envoi ne fera pas l'objet
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
    </Dropdown>
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

type ExpirationDateProps = {
  projectId: string
  canUpdate: boolean
  expirationDate: number | undefined
}
const ExpirationDate = ({ projectId, canUpdate, expirationDate }: ExpirationDateProps) => {
  const [isFormVisible, showForm] = useState(false)
  return (
    <>
      <div className={`flex ${expirationDate && `gap-2`}`}>
        {expirationDate && <p className="m-0">Date d'échéance : {formatDate(expirationDate)}</p>}
        {canUpdate && (
          <a onClick={() => showForm(!isFormVisible)}>
            {expirationDate ? `éditer` : `Renseigner la date d'échéance`}
          </a>
        )}
      </div>
      {isFormVisible && (
        <AddExpirationDateForm
          projectId={projectId}
          onCancel={() => {
            showForm(false)
          }}
        />
      )}
    </>
  )
}

type AddExpirationDateFormProps = {
  projectId: string
  onCancel: () => void
}
const AddExpirationDateForm = ({ projectId, onCancel }: AddExpirationDateFormProps) => {
  return (
    <form
      action={ROUTES.ADD_GF_EXPIRATION_DATE({ projectId })}
      method="POST"
      className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
    >
      <FormulaireChampsObligatoireLégende className="ml-auto" />
      <input name="projectId" value={projectId} readOnly hidden />
      <Label htmlFor="expirationDate" required>
        Date d'échéance des garanties financières
        <Astérisque className="text-black" />
      </Label>
      <Input required type="date" name="expirationDate" id="expirationDate" />
      <p className="italic">
        <Astérisque className="text-black" /> À noter : la garantie doit avoir une durée couvrant le
        projet jusqu’à 6 mois après la date d’Achèvement de l’installation ou être renouvelée
        régulièrement afin d’assurer une telle couverture temporelle.
      </p>
      <div className="flex gap-4 flex-col md:flex-row">
        <Button type="submit" primary>
          Enregistrer
        </Button>
        <Button onClick={() => onCancel()}>Annuler</Button>
      </div>
    </form>
  )
}
