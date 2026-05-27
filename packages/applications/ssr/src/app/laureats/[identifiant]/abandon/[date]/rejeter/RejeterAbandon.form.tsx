'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import type { ValidationErrors } from '@/utils/formAction';
import { AlerteAnnulationPPA } from '../AlerteAnnulationPPA';
import { type RejeterAbandonFormKeys, rejeterAbandonAction } from './rejeterAbandon.action';

type RejeterAbandonFormProps = {
  identifiantProjet: string;
  ppaSignaléLorsDeLaDemande?: true;
};

export const RejeterAbandonForm = ({
  identifiantProjet,
  ppaSignaléLorsDeLaDemande,
}: RejeterAbandonFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterAbandonFormKeys>
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
        id="rejeter-abandon"
        title="Rejeter l'abandon"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterAbandonAction,
          id: 'rejeter-abandon-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              {ppaSignaléLorsDeLaDemande && <AlerteAnnulationPPA />}

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
                className="mt-4"
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
