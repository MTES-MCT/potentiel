'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import {
  accorderChangementPuissanceAction,
  AccorderChangementPuissanceFormKeys,
} from './accorderChangementPuissance.action';

type AccorderChangementPuissanceFormProps = {
  identifiantProjet: string;
};

export const AccorderChangementPuissance = ({
  identifiantProjet,
}: AccorderChangementPuissanceFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderChangementPuissanceFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="block text-center">
        Accorder
      </Button>

      <ModalWithForm
        id="accorder-changement-puissance-modal"
        title="Accorder le changement de puissance"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderChangementPuissanceAction,
          id: 'accorder-changement-puissance-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder ce changement de puissance ?</p>

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
                url={Routes.Puissance.changement.téléchargerModèleRéponse(identifiantProjet)}
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
