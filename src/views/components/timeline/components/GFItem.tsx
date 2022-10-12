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
  SecondaryButton,
  FormulaireChampsObligatoireLégende,
  Input,
  Label,
  Astérisque,
  DownloadLink,
  Dropdown,
  Link,
} from '@components'

type ComponentProps = GFItemProps & {
  project: { id: string; status: ProjectStatus; garantieFinanciereEnMois?: number }
}

const getInfoDuréeGF = (garantieFinanciereEnMois?: number) => {
  return garantieFinanciereEnMois
    ? `la durée de l’engagement ne peut être inférieure à ${garantieFinanciereEnMois} mois.`
    : `La garantie doit avoir une durée couvrant le
            projet jusqu’à 6 mois après la date d’achèvement de l’installation ou être renouvelée
            régulièrement afin d’assurer une telle couverture temporelle.`
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
  const isAdmin = role === 'admin'
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
            <SubmitForm
              projectId={project.id}
              garantieFinanciereEnMois={project.garantieFinanciereEnMois}
            />
          )}
          {(isDreal || isAdmin) && (
            <UploadForm
              projectId={project.id}
              role={role}
              garantieFinanciereEnMois={project.garantieFinanciereEnMois}
            />
          )}
          {(isDreal || isAdmin) && status === 'past-due' && (
            <p className="m-0">
              <DownloadLink
                fileUrl={ROUTES.TELECHARGER_MODELE_MISE_EN_DEMEURE({ id: project.id, nomProjet })}
              >
                Télécharger le modèle de mise en demeure
              </DownloadLink>
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
  const canAddExpDate = role === 'porteur-projet' || role === 'dreal' || role === 'admin'

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
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
        />
        <div className="flex">
          {url ? (
            <DownloadLink fileUrl={url}>
              Télécharger l'attestation de garanties financières
            </DownloadLink>
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
  const canAddExpDate = role === 'porteur-projet' || role === 'dreal' || role === 'admin'

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
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
        />
        <div>
          {url ? (
            <>
              <DownloadLink fileUrl={url}>
                Télécharger l'attestation de garanties financières
              </DownloadLink>
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
  garantieFinanciereEnMois?: number
}
const SubmitForm = ({ projectId, garantieFinanciereEnMois }: SubmitFormProps) => {
  const [isFormVisible, showForm] = useState(false)

  return (
    <>
      <Link onClick={() => showForm(!isFormVisible)}>Transmettre l'attestation</Link>
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
            <Astérisque className="text-black" />
            {getInfoDuréeGF(garantieFinanciereEnMois)}
          </p>
          <div className="flex gap-4 flex-col md:flex-row">
            <Button type="submit">Enregistrer</Button>
            <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
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
  <Link
    href={ROUTES.REMOVE_GARANTIES_FINANCIERES({
      projectId,
    })}
    data-confirm="Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?"
  >
    Annuler le dépôt
  </Link>
)

/* PPE2 */

type NotUploadedProps = ComponentProps

const NotUploaded = ({ role, project }: NotUploadedProps) => {
  const hasRightsToUpload = role === 'porteur-projet' || role === 'dreal' || role === 'admin'
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <ItemTitle title={'Constitution des garanties financières'} />
        <span>Attestation de constitution des garanties financières soumise à la candidature</span>
        {hasRightsToUpload && (
          <UploadForm
            projectId={project.id}
            role={role}
            garantieFinanciereEnMois={project.garantieFinanciereEnMois}
          />
        )}
      </ContentArea>
    </>
  )
}

type UploadedProps = ComponentProps & { status: 'uploaded' }

const Uploaded = ({ date, url, role, project, expirationDate, uploadedByRole }: UploadedProps) => {
  const canUpdateGF = role === 'porteur-projet' || role === 'dreal' || role === 'admin'

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
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
        />
        <div className="flex">
          {url ? (
            <DownloadLink fileUrl={url}>
              Télécharger l'attestation de garanties financières
            </DownloadLink>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {canUpdateGF && <WithdrawDocument projectId={project.id} uploadedByRole={uploadedByRole} />}
        {uploadedByRole === 'dreal' && (
          <p className="m-0 italic">Ce document a été ajouté par la DREAL</p>
        )}
        {uploadedByRole === 'admin' && (
          <p className="m-0 italic">Ce document a été ajouté par la DGEC</p>
        )}
      </ContentArea>
    </>
  )
}

type UploadFormProps = {
  projectId: string
  role: 'porteur-projet' | 'dreal' | 'admin'
  garantieFinanciereEnMois?: number
}
const UploadForm = ({ projectId, role, garantieFinanciereEnMois }: UploadFormProps) => {
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
            {getInfoDuréeGF(garantieFinanciereEnMois)}
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
          <Button type="submit">Enregistrer</Button>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </form>
    </Dropdown>
  )
}

type WithdrawDocumentProps = {
  projectId: string
  uploadedByRole?: 'porteur-projet' | 'dreal' | 'admin'
}
const WithdrawDocument = ({ projectId, uploadedByRole }: WithdrawDocumentProps) => (
  <p className="p-0 m-0">
    <Link
      href={ROUTES.WITHDRAW_GARANTIES_FINANCIERES({
        projectId,
      })}
      data-confirm="Êtes-vous sur de vouloir retirer l'attestion jointe ?"
    >
      Retirer le document de Potentiel
    </Link>
    {uploadedByRole === 'porteur-projet' && (
      <span> (cela n'annule pas les garanties financières soumises à la candidature)</span>
    )}
  </p>
)

type ExpirationDateProps = {
  projectId: string
  canUpdate: boolean
  expirationDate: number | undefined
  garantieFinanciereEnMois?: number
}
const ExpirationDate = ({
  projectId,
  canUpdate,
  expirationDate,
  garantieFinanciereEnMois,
}: ExpirationDateProps) => {
  const [isFormVisible, showForm] = useState(false)
  return (
    <>
      <div className={`flex ${expirationDate && `gap-2`}`}>
        {expirationDate && <p className="m-0">Date d'échéance : {formatDate(expirationDate)}</p>}
        {canUpdate && (
          <Link onClick={() => showForm(!isFormVisible)}>
            {expirationDate ? `éditer` : `Renseigner la date d'échéance`}
          </Link>
        )}
      </div>
      {isFormVisible && (
        <AddExpirationDateForm
          projectId={projectId}
          onCancel={() => {
            showForm(false)
          }}
          garantieFinanciereEnMois={garantieFinanciereEnMois}
        />
      )}
    </>
  )
}

type AddExpirationDateFormProps = {
  projectId: string
  onCancel: () => void
  garantieFinanciereEnMois?: number
}
const AddExpirationDateForm = ({
  projectId,
  onCancel,
  garantieFinanciereEnMois,
}: AddExpirationDateFormProps) => {
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
        <Astérisque className="text-black" /> À noter : {getInfoDuréeGF(garantieFinanciereEnMois)}
      </p>
      <div className="flex gap-4 flex-col md:flex-row">
        <Button type="submit">Enregistrer</Button>
        <SecondaryButton onClick={() => onCancel()}>Annuler</SecondaryButton>
      </div>
    </form>
  )
}
