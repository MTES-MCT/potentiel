'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import {
  rejeterChangementActionnaireAction,
  RejeterChangementActionnaireFormKeys,
} from './rejeterChangementActionnaire.action';

type RejeterChangementActionnaireFormProps = {
  identifiantProjet: string;
};

export const RejeterChangementActionnaire = ({
  identifiantProjet,
}: RejeterChangementActionnaireFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterChangementActionnaireFormKeys>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)} className="block text-center">
        Rejeter
      </Button>

      <ModalWithForm
        id="rejeter-changement-actionnaire-modal"
        title="Rejeter le changement d'actionnaire"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementActionnaireAction,
          id: 'rejeter-changement-actionnaire-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir rejeter ce changement d'actionnaire ?</p>

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
            </>
          ),
        }}
      />
    </>
  );
};
