'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Lauréat } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';

import {
  accorderChangementReprésentantLégalAction,
  AccorderChangementReprésentantLégalFormKeys,
} from './accorderChangementReprésentantLégal.action';

type AccorderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
  dateDemande: string;
};

export const AccorderChangementReprésentantLégal = ({
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  dateDemande,
}: AccorderChangementReprésentantLégalFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<AccorderChangementReprésentantLégalFormKeys>
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
        id="accorder-changementReprésentantLégal-modal"
        title="Accorder le changement de représentant légal"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: accorderChangementReprésentantLégalAction,
          id: 'accorder-changementReprésentantLégal-form',
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={dateDemande} name="dateDemande" />

              <input
                id="typeRepresentantLegal"
                name="typeRepresentantLegal"
                hidden
                value={typeReprésentantLégal}
              />

              <Input
                label="Nom du représentant légal (à corriger si besoin)"
                id="nomRepresentantLegal"
                nativeInputProps={{
                  name: 'nomRepresentantLegal',
                  required: true,
                  'aria-required': true,
                  defaultValue: nomReprésentantLégal,
                }}
                state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors['nomRepresentantLegal']}
              />
            </>
          ),
        }}
      />
    </>
  );
};
