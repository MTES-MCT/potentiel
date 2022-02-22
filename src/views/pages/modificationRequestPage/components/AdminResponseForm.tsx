import React from 'react'
import { UploadResponseFile } from '.'
import { dataId } from '../../../../helpers/testId'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { UserRole } from '@modules/users'
import ROUTES from '../../../../routes'
import { ModificationRequestTitleByType } from '../../../helpers'

interface AdminResponseFormProps {
  modificationRequest: ModificationRequestPageDTO
  role: UserRole
  children: React.ReactNode
}
export const AdminResponseForm = ({
  modificationRequest,
  role,
  children,
}: AdminResponseFormProps) => {
  const { type, versionDate } = modificationRequest

  return (
    <form
      action={ROUTES.ADMIN_REPLY_TO_MODIFICATION_REQUEST}
      method="post"
      encType="multipart/form-data"
      style={{ margin: 0 }}
    >
      <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
      <input type="hidden" name="type" value={modificationRequest.type} />
      <input type="hidden" name="versionDate" value={versionDate} />

      {role !== 'dreal' && (
        <div className="form__group" style={{ marginBottom: 20 }}>
          <label htmlFor="statusUpdateOnly">
            <input
              type="checkbox"
              name="statusUpdateOnly"
              defaultChecked={false}
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

      <UploadResponseFile modificationRequest={modificationRequest} />

      {children}

      <button
        className="button flex-1"
        type="submit"
        name="submitAccept"
        data-confirm={`Etes-vous sur de vouloir accepter la demande ${ModificationRequestTitleByType[type]} ?`}
        {...dataId('submit-button')}
      >
        Accepter la demande {ModificationRequestTitleByType[type]}
      </button>
      <button
        className="button warning flex-1"
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
