'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

// import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  rejeterChangementReprésentantLégalAction,
  RejeterChangementReprésentantLégalFormKeys,
} from './rejeterChangementReprésentantLégal.action';

type RejeterChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const RejeterChangementReprésentantLégal = ({
  identifiantProjet,
}: RejeterChangementReprésentantLégalFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterChangementReprésentantLégalFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Rejeter
      </Button>

      <ModalWithForm
        id="rejeter-changementReprésentantLégal-modal"
        title="Rejeter le changementReprésentantLégal"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementReprésentantLégalAction,
          method: 'POST',
          encType: 'multipart/form-data',
          id: 'rejeter-changementReprésentantLégal-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

              <UploadDocument
                label="Réponse signée"
                state={validationErrors['reponseSignee'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['reponseSignee']}
                name="reponseSignee"
                required
                className="mb-4"
              />

              <DownloadDocument
                className="mt-4"
                url={'#'} // Routes.ChangementReprésentantLégal.téléchargerModèleRéponse(identifiantProjet)}
                format="docx"
                label="Télécharger le modèle de réponse"
              />
            </>
          ),
        }}
      />
    </>
  );
};
