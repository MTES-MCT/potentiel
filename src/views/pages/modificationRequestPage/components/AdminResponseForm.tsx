import { FormulaireChampsObligatoireLégende, Button } from '@components';
import { ModificationRequestPageDTO } from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
import React from 'react';
import { UploadResponseFile } from '.';
import { ModificationRequestTitleByType } from '../../../helpers';

interface AdminResponseFormProps {
  modificationRequest: ModificationRequestPageDTO;
  role: UserRole;
  children?: React.ReactNode;
}

function getAdminRouteBasedOnType(type) {
  switch (type) {
    case 'delai':
      return ROUTES.ADMIN_REPONDRE_DEMANDE_DELAI;
    case 'abandon':
      return ROUTES.ADMIN_REPONDRE_DEMANDE_ABANDON;
    case 'annulation abandon':
      return ROUTES.POST_REPONDRE_DEMANDE_ANNULATION_ABANDON;
    default:
      return ROUTES.ADMIN_REPLY_TO_MODIFICATION_REQUEST;
  }
}

export const AdminResponseForm = ({ modificationRequest, children }: AdminResponseFormProps) => {
  const { type, versionDate } = modificationRequest;

  return (
    <form
      action={getAdminRouteBasedOnType(type)}
      method="post"
      encType="multipart/form-data"
      className="m-0"
    >
      {type !== 'puissance' && <FormulaireChampsObligatoireLégende className="text-left mb-3" />}

      <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
      <input type="hidden" name="type" value={modificationRequest.type} />
      <input type="hidden" name="versionDate" value={versionDate} />

      <UploadResponseFile modificationRequest={modificationRequest} />
      {children}

      <Button
        type="submit"
        name="submitAccept"
        onClick={(event) =>
          confirm(
            `Etes-vous sur de vouloir accepter la demande ${ModificationRequestTitleByType[type]} ?`,
          ) || event.preventDefault()
        }
        className="mt-4"
      >
        Accepter la demande {ModificationRequestTitleByType[type]}
      </Button>
      <button
        className="button warning flex-1"
        type="submit"
        onClick={(event) =>
          confirm(
            `Etes-vous sur de vouloir rejeter la demande ${ModificationRequestTitleByType[type]} ?`,
          ) || event.preventDefault()
        }
        name="submitRefuse"
      >
        Rejeter la demande {ModificationRequestTitleByType[type]}
      </button>
    </form>
  );
};
