import React, { useState } from 'react'
import { ItemTitle, ItemDate, ContentArea, PastIcon, CurrentIcon } from '../components'
import ROUTES from '@routes'
import { Button } from '../../'
import { WarningItem } from '../components/WarningItem'
import { DCRItemProps } from '../helpers/extractDCRItemProps'
import { WarningIcon } from './WarningIcon'
import { Input } from '../../inputs'
import { format } from 'date-fns'

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
              Télécharger l'accusé de réception
            </a>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
          {numeroDossier && <span>&nbsp;(dossier {numeroDossier})</span>}
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
      {status === 'past-due' && role === 'porteur-projet' ? <WarningIcon /> : <CurrentIcon />}
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={date} />
          </div>
          {status === 'past-due' && role === 'porteur-projet' && (
            <div className="align-middle mb-1">
              <WarningItem message="date dépassée" />
            </div>
          )}
        </div>
        <ItemTitle title="Demande complète de raccordement" />
        <div>
          {role === 'porteur-projet' ? (
            <>
              <p className="mt-0 mb-0">
                Après avoir effectué cette démarche auprès votre gestionnaire de réseau, vous pouvez
                nous transmettre l'accusé de réception.
              </p>
              <UploadForm projectId={projectId} />
            </>
          ) : (
            <p className="mt-0 mb-0">Accusé de réception de la demande en attente</p>
          )}
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
        confirm(`Êtes-vous sur de vouloir annuler le dépôt et supprimer le document joint ?`) ||
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
      <a onClick={() => showForm(!isFormVisible)}>Transmettre l'accusé de réception</a>
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
            <label htmlFor="stepDate">Date de l'accusé de réception</label>
            <Input
              type="date"
              id="stepDate"
              name="stepDate"
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
          <div className="mt-2">
            <label htmlFor="numero-dossier">
              Identifiant gestionnaire de réseau (ex : GEFAR-P)
            </label>
            <Input type="text" name="numeroDossier" id="numero-dossier" required />
          </div>
          <div className="mt-2">
            <label htmlFor="file">Accusé de réception</label>
            <Input type="file" name="file" id="file" required />
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
