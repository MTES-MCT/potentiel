'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import {
  accorderChangementActionnaireAction,
  AccorderChangementActionnaireFormKeys,
} from './accorderChangementActionnaire.action';

type AccorderChangementActionnaireFormProps = {
  identifiantProjet: string;
};

export const AccorderChangementActionnaire = ({
  identifiantProjet,
}: AccorderChangementActionnaireFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderChangementActionnaireFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="block text-center">
        Accorder la demande de modification de l’actionnariat
      </Button>

      <ModalWithForm
        id="accorder-changement-actionnaire-modal"
        title="Accorder la demande de modification de l’actionnariat"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderChangementActionnaireAction,
          id: 'accorder-changement-actionnaire-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir accorder cette modification de l'actionnariat ?
              </p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

              <UploadNewOrModifyExistingDocument
                label="Réponse signée"
                state={validationErrors['reponseSignee'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['reponseSignee']}
                name="reponseSignee"
                required
                className="mb-4"
                formats={['pdf']}
              />

              <DownloadDocument
                className="mb-4"
                url={Routes.Actionnaire.changement.téléchargerModèleRéponse(
                  identifiantProjet,
                  true,
                )}
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
