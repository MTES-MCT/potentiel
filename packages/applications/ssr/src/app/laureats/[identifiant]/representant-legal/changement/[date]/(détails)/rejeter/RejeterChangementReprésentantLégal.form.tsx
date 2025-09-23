'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';

import {
  rejeterChangementReprésentantLégalAction,
  RejeterChangementReprésentantLégalFormKeys,
} from './rejeterChangementReprésentantLégal.action';

type RejeterChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  dateDemande: string;
};

export const RejeterChangementReprésentantLégal = ({
  identifiantProjet,
  dateDemande,
}: RejeterChangementReprésentantLégalFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<RejeterChangementReprésentantLégalFormKeys>
  >({});

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
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementReprésentantLégalAction,
          id: 'rejeter-changementReprésentantLégal-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={dateDemande} name="dateDemande" />

              <Input
                className="mt-3"
                label="Motif du rejet"
                hintText="Veuillez préciser le motif du rejet"
                state={validationErrors['motifRejet'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['motifRejet']}
                textArea
                nativeTextAreaProps={{
                  name: 'motifRejet',
                  required: true,
                  'aria-required': true,
                }}
              />
              <p>Êtes-vous sûr de vouloir rejeter ce changement de représentant légal ?</p>
            </>
          ),
        }}
      />
    </>
  );
};
