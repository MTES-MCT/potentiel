import { ChampsObligatoiresLégende, Form, PrimaryButton } from '../../../components';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import { UserRole } from '../../../../modules/users';
import ROUTES from '../../../../routes';
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
    <Form action={getAdminRouteBasedOnType(type)} method="post" encType="multipart/form-data">
      <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
      <input type="hidden" name="type" value={modificationRequest.type} />
      <input type="hidden" name="versionDate" value={versionDate} />
      <ChampsObligatoiresLégende className="mb-3" />
      {modificationRequest.type !== 'puissance' && (
        <UploadResponseFile modificationRequest={modificationRequest} />
      )}
      {children}
      <PrimaryButton
        type="submit"
        name="submitAccept"
        confirmation={`Êtes-vous sur de vouloir accepter la demande ${ModificationRequestTitleByType[type]} ?`}
        className="mt-4 mr-4"
      >
        Accepter la demande {ModificationRequestTitleByType[type]}
      </PrimaryButton>
      <PrimaryButton
        className="bg-red-marianne-425-base hover:bg-red-marianne-425-hover focus:bg-red-marianne-425-active block mt-4"
        type="submit"
        confirmation={`Êtes-vous sur de vouloir rejeter la demande ${ModificationRequestTitleByType[type]} ?`}
        name="submitRefuse"
      >
        Rejeter la demande {ModificationRequestTitleByType[type]}
      </PrimaryButton>
    </Form>
  );
};
