import React from 'react'
import { User } from '../../../../entities'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest'
import ROUTES from '../../../../routes'
import { ModificationRequestTitleByType } from '../../../helpers'

interface AdminResponseFormProps {
  modificationRequest: ModificationRequestPageDTO
  role: User['role']
  children: React.ReactNode
}
export const AdminResponseForm = ({
  modificationRequest,
  role,
  children,
}: AdminResponseFormProps) => {
  const { type, versionDate } = modificationRequest
  const isResponsePossible = ['recours', 'delai', 'abandon', 'puissance'].includes(type)

  return (
    <form
      action={ROUTES.ADMIN_REPLY_TO_MODIFICATION_REQUEST}
      method="post"
      encType="multipart/form-data"
      style={{ margin: 0 }}
    >
      <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
      <input type="hidden" name="type" value={modificationRequest.type} />
      <input type="hidden" name="versionDate" value={versionDate.getTime()} />

      {role !== 'dreal' && (
        <div className="form__group" style={{ marginBottom: 20 }}>
          <label htmlFor="statusUpdateOnly">
            <input
              type="checkbox"
              name="statusUpdateOnly"
              defaultChecked={!isResponsePossible}
              {...dataId('modificationRequest-statusUpdateOnlyField')}
            />
            Demande traitée hors Potentiel
          </label>
          <div style={{ fontSize: 11, lineHeight: '1.5em', marginTop: 3 }}>
            En cochant cette case, seul le statut de la demande sera mise à jour. La réponse n‘aura
            pas d‘impact sur le projet et le porteur de projet ne sera pas notifié.
          </div>
        </div>
      )}

      <div className="form__group" style={{ marginBottom: 20 }}>
        <label htmlFor="replyWithoutAttachment">
          <input
            type="checkbox"
            name="replyWithoutAttachment"
            {...dataId('modificationRequest-replyWithoutAttachmentField')}
          />
          Répondre sans pièce jointe
        </label>
      </div>

      {children}

      <button
        className="button"
        type="submit"
        name="submitAccept"
        data-confirm={`Etes-vous sur de vouloir accepter la demande ${ModificationRequestTitleByType[type]} ?`}
        {...dataId('submit-button')}
      >
        Accepter la demande {ModificationRequestTitleByType[type]}
      </button>
      <button
        className="button warning"
        type="submit"
        data-confirm={`Etes-vous sur de vouloir refuser la demande ${ModificationRequestTitleByType[type]} ?`}
        name="submitRefuse"
        {...dataId('submit-button-alt')}
      >
        Refuser la demande {ModificationRequestTitleByType[type]}
      </button>
    </form>
  )
}
