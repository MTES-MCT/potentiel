import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '.'
import ROUTES from '../../../../routes'
import { Button, Input } from '../..'
import { PTFItemProps } from '../helpers/extractPTFItemProps'
import { UserRole } from '@modules/users'
import { format } from 'date-fns'

export const PTFItem = (props: PTFItemProps & { projectId: string }) => {
  const { projectId, status } = props

  return status === 'submitted' ? (
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
          <a href={url} download>
            Télécharger la proposition technique et financière
          </a>
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

  return (
    <>
      <a onClick={() => showForm(!isFormVisible)}>Indiquer la date de la signature</a>
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
            <label htmlFor="stepDate">Date de la signature</label>
            <Input
              type="date"
              id="stepDate"
              name="stepDate"
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
          <div className="mt-2">
            <label htmlFor="file">Document*</label>
            <Input type="file" name="file" id="file" required />
            <span className="italic">
              * Le dépôt est informatif, il ne remplace pas la transmission à votre gestionnaire
            </span>
          </div>
          <div className="flex gap-4 flex-col md:flex-row mt-4">
            <Button type="submit" primary>
              Envoyer
            </Button>
            <Button onClick={() => showForm(false)}>Annuler</Button>
          </div>
        </form>
      )}
    </>
  )
}
const isPorteurProjet = (role: UserRole) => role === 'porteur-projet'
