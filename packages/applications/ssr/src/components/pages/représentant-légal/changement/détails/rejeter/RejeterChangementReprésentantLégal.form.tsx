'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

// import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
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
        title="Rejeter le changement de représentant légal"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementReprésentantLégalAction,
          id: 'rejeter-changementReprésentantLégal-form',
          omitMandatoryFieldsLegend: true,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir rejeter ce changement de représentant légal ?
              </p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <Input
                textArea
                label="Raison du rejet"
                id="raison"
                nativeTextAreaProps={{
                  name: 'raison',
                  required: true,
                  'aria-required': true,
                }}
                state={validationErrors['raison'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['raison']}
              />
            </>
          ),
        }}
      />
    </>
  );
};
