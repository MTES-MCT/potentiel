import React, { useState } from 'react'
import { format } from 'date-fns'
import ROUTES from '@routes'
import { UserRole } from '@modules/users'
import {
  Button,
  SecondaryButton,
  FormulaireChampsObligatoireLégende,
  Input,
  Label,
  Dropdown,
  DownloadLink,
  Link,
  ExclamationIcon,
} from '@components'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import { PtfDTO } from '@modules/frise'

export const PTFItem = (props: PtfDTO & { projectId: string }) => {
  const { projectId, statut } = props

  return statut === 'envoyée' ? (
    <Submitted {...{ ...props, projectId }} />
  ) : (
    <NotSubmitted {...{ ...props, projectId }} />
  )
}

type SubmittedProps = {
  role: UserRole
  date: number
  url?: string
  projectId: string
}
const Submitted = ({ role, date, url, projectId }: SubmittedProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <div className="align-middle">
        <ItemDate date={date} />
      </div>
      <ItemTitle title="Proposition technique et financière" />
      {url ? (
        <div>
          <DownloadLink fileUrl={url}>
            Télécharger la proposition technique et financière
          </DownloadLink>
        </div>
      ) : (
        <div>Pièce-jointe introuvable</div>
      )}
      {isPorteurProjet(role) && <CancelDeposit {...{ projectId }} />}
    </ContentArea>
  </>
)

type NotSubmittedProps = {
  role: UserRole
  projectId: string
}
const NotSubmitted = ({ role, projectId }: NotSubmittedProps) => (
  <>
    <CurrentIcon />
    <ContentArea>
      <ItemTitle title="Proposition technique et financière" />
      <div>
        <p className="mt-0 mb-0">Proposition technique et financière en attente</p>
        {isPorteurProjet(role) && <UploadForm projectId={projectId} />}
      </div>
    </ContentArea>
  </>
)

type CancelDepositProps = { projectId: string }
const CancelDeposit = ({ projectId }: CancelDepositProps) => {
  return (
    <Link
      href={ROUTES.SUPPRIMER_ETAPE_ACTION({ projectId, type: 'ptf' })}
      onClick={(event) =>
        confirm(`Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?`) ||
        event.preventDefault()
      }
    >
      Annuler le dépôt
    </Link>
  )
}

type UploadFormProps = {
  projectId: string
}
const UploadForm = ({ projectId }: UploadFormProps) => {
  const [displayForm, showForm] = useState(false)

  return (
    <Dropdown
      design="link"
      text="Indiquer la date de la signature"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
    >
      <form
        action={ROUTES.DEPOSER_ETAPE_ACTION}
        method="post"
        encType="multipart/form-data"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <FormulaireChampsObligatoireLégende className="text-right" />
        <input type="hidden" name="type" id="type" value="ptf" />
        <input type="hidden" name="projectId" value={projectId} />
        <div>
          <Label htmlFor="stepDate" required>
            Date de la signature
          </Label>
          <Input
            type="date"
            id="stepDate"
            name="stepDate"
            max={format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>
        <div className="mt-2">
          <Label htmlFor="file" required className="flex items-center">
            Document <ExclamationIcon className="h-4 w-4 mx-1" />
          </Label>
          <Input type="file" name="file" id="file" required />
          <span className="italic flex items-start">
            <ExclamationIcon className="h-4 w-4 mt-1 mr-1" />
            Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire
          </span>
        </div>
        <div className="flex gap-4 flex-col md:flex-row mt-4">
          <Button type="submit">Envoyer</Button>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </form>
    </Dropdown>
  )
}
const isPorteurProjet = (role: UserRole) => role === 'porteur-projet'
