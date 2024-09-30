'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  AccorderDemandeMainlevéeFormKeys,
  accorderDemandeMainlevéeGarantiesFinancièresAction,
} from './accorderDemandeMainlevéeGarantiesFinancières.action';

type AccorderDemandeMainlevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const AccorderDemandeMainlevéeGarantiesFinancières = ({
  identifiantProjet,
}: AccorderDemandeMainlevéeGarantiesFinancièresFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderDemandeMainlevéeFormKeys>
  >({});

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Accorder
      </Button>

      <ModalWithForm
        id="accorder-demande-gf"
        title="Accorder la demande"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderDemandeMainlevéeGarantiesFinancièresAction,
          method: 'POST',
          encType: 'multipart/form-data',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),

          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder la demande de mainlevée ?</p>

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
                url={Routes.GarantiesFinancières.demandeMainlevée.téléchargerModèleRéponseAccordé(
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
