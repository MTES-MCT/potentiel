import { FormulaireChampsObligatoireLégende, Button, InputCheckbox } from '@components';
import { ModificationRequestPageDTO } from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
import React, { useState } from 'react';
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

export const AdminResponseForm = ({
  modificationRequest,
  role,
  children,
}: AdminResponseFormProps) => {
  const { type, versionDate } = modificationRequest;

  const [demandeTraitéeHorsPotentiel, setDemandeTraitéeHorsPotentiel] = useState(false);
  return (
    <form
      action={getAdminRouteBasedOnType(type)}
      method="post"
      encType="multipart/form-data"
      className="m-0"
    >
      {type !== 'puissance' && !demandeTraitéeHorsPotentiel && (
        <FormulaireChampsObligatoireLégende className="text-left mb-3" />
      )}

      <input type="hidden" name="modificationRequestId" value={modificationRequest.id} />
      <input type="hidden" name="type" value={modificationRequest.type} />
      <input type="hidden" name="versionDate" value={versionDate} />

      {role !== 'dreal' && (
        <div className="form__group mb-5">
          <label htmlFor="statusUpdateOnly">
            <InputCheckbox
              type="checkbox"
              name="statusUpdateOnly"
              checked={demandeTraitéeHorsPotentiel}
              onChange={({ target: { checked } }) => setDemandeTraitéeHorsPotentiel(checked)}
            />
            Demande traitée hors Potentiel
          </label>
          <div className="text-xs leading-6 mt-1">
            En cochant cette case, seul le statut de la demande sera mis à jour. La réponse n‘aura
            pas d‘impact sur le projet et le porteur de projet ne sera pas notifié.
          </div>
        </div>
      )}

      {!demandeTraitéeHorsPotentiel && (
        <>
          <UploadResponseFile modificationRequest={modificationRequest} />
          {children}
        </>
      )}

      <Button
        type="submit"
        name="submitAccept"
        data-confirm={`Etes-vous sur de vouloir accepter la demande ${ModificationRequestTitleByType[type]} ?`}
        className="mt-4"
      >
        Accepter la demande {ModificationRequestTitleByType[type]}
      </Button>
      <button
        className="button warning flex-1"
        type="submit"
        data-confirm={`Etes-vous sur de vouloir rejeter la demande ${ModificationRequestTitleByType[type]} ?`}
        name="submitRefuse"
      >
        Rejeter la demande {ModificationRequestTitleByType[type]}
      </button>
    </form>
  );
};
