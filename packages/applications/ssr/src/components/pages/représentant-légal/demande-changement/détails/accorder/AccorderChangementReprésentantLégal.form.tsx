'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

// import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { ValidationErrors } from '@/utils/formAction';

import {
  accorderChangementReprésentantLégalAction,
  AccorderChangementReprésentantLégalFormKeys,
} from './accorderChangementReprésentantLégal.action';

type AccorderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  typeReprésentantLégal: string;
  nomReprésentantLégal: string;
};

export const AccorderChangementReprésentantLégal = ({
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
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

              <SelectNext
                label="Type de personne pour le représentant légal"
                placeholder={`Sélectionner le type de personne pour le représentant légal`}
                state={validationErrors.typeRepresentantLegal ? 'error' : 'default'}
                stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
                options={['Personne physique', 'Personne morale', 'Collectivité', 'Autre'].map(
                  (type) => ({
                    label: type,
                    value: type,
                  }),
                )}
                nativeSelectProps={{
                  value: typeReprésentantLégal,
                }}
              />

              <Input
                label="Nom du représentant légal"
                id="nomRepresentantLegal"
                nativeInputProps={{
                  name: 'nomRepresentantLegal',
                  required: true,
                  'aria-required': true,
                  value: nomReprésentantLégal,
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
