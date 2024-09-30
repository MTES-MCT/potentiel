'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  accorderAbandonSansRecandidatureAction,
  AccorderAbandonSansRecandidatureFormKeys,
} from './accorderAbandonSansRecandidature.action';

type AccorderAbandonSansRecandidatureFormProps = {
  identifiantProjet: string;
};

export const AccorderAbandonSansRecandidature = ({
  identifiantProjet,
}: AccorderAbandonSansRecandidatureFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderAbandonSansRecandidatureFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Accorder
      </Button>

      <ModalWithForm
        id="accorder-abandon-sans-recandidature"
        title="Accorder l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderAbandonSansRecandidatureAction,
          method: 'POST',
          encType: 'multipart/form-data',
          id: 'accorder-abandon-form',
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
