'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  rejeterDemandeMainlevéeAction,
  RejeterDemandeMainlevéeGarantiesFinancièresFormKeys,
} from './rejeterDemandeMainlevée.action';

type rejeterDemandeMainlevéeFormProps = {
  identifiantProjet: string;
};

export const RejeterDemandeMainlevéeForm = ({
  identifiantProjet,
}: rejeterDemandeMainlevéeFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterDemandeMainlevéeGarantiesFinancièresFormKeys>
  >({});

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        Rejeter
      </Button>

      <ModalWithForm
        id="rejeter-demande"
        title="Rejeter la demande"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterDemandeMainlevéeAction,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),

          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir rejeter la demande de mainlevée ?</p>

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
                url={Routes.GarantiesFinancières.demandeMainlevée.téléchargerModèleRéponseRejeté(
                  identifiantProjet,
                )}
                format="docx"
                label="Télécharger le modèle de réponse"
              />

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
