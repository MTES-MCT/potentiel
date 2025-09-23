'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import {
  rejeterChangementActionnaireAction,
  RejeterChangementActionnaireFormKeys,
} from './rejeterChangementActionnaire.action';

type RejeterChangementActionnaireFormProps = {
  identifiantProjet: string;
  dateDemande: string;
};

export const RejeterChangementActionnaire = ({
  identifiantProjet,
  dateDemande,
}: RejeterChangementActionnaireFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterChangementActionnaireFormKeys>
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
        id="rejeter-changement-actionnaire-modal"
        title="Rejeter"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementActionnaireAction,
          id: 'rejeter-changement-actionnaire-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir rejeter ce changement d'actionnaire(s) ?
              </p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={dateDemande} name="dateDemande" />

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
                url={Routes.Actionnaire.changement.téléchargerModèleRéponseRejeté(
                  identifiantProjet,
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
