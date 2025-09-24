'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  demanderConfirmationAbandonAction,
  DemanderConfirmationAbandonFormKeys,
} from './demanderConfirmationAbandon.action';

type DemanderConfirmationAbandonFormProps = {
  identifiantProjet: string;
};

export const DemanderConfirmationAbandon = ({
  identifiantProjet,
}: DemanderConfirmationAbandonFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderConfirmationAbandonFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Demander la confirmation
      </Button>

      <ModalWithForm
        id="demander-confirmation-abandon"
        title="Demander la confirmation de l'abandon"
        cancelButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'demande-confirmation-abandon-form',
          action: demanderConfirmationAbandonAction,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

              <UploadNewOrModifyExistingDocument
                label="Réponse signée"
                state={validationErrors['reponseSignee'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['reponseSignee']}
                name="reponseSignee"
                required
                className="mb-8"
                formats={['pdf']}
              />

              <DownloadDocument
                className="mb-4"
                url={Routes.Abandon.téléchargerModèleRéponse(identifiantProjet)}
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
