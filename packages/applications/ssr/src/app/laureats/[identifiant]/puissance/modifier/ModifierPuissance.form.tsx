'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat, IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import { modifierPuissanceAction, ModifierPuissanceFormKeys } from './modifierPuissance.action';

export type ModifierPuissanceFormProps = PlainType<
  Pick<
    Lauréat.Puissance.ConsulterPuissanceReadModel,
    'identifiantProjet' | 'puissance' | 'unitéPuissance' | 'puissanceDeSite'
  > & { infosCahierDesChargesPuissanceDeSite: 'requis' | 'optionnel' | undefined }
>;

export const ModifierPuissanceForm: FC<ModifierPuissanceFormProps> = ({
  identifiantProjet,
  puissance,
  puissanceDeSite,
  unitéPuissance: { unité: unitéPuissance },
  infosCahierDesChargesPuissanceDeSite,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierPuissanceFormKeys>
  >({});

  return (
    <Form
      action={modifierPuissanceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
        {infosCahierDesChargesPuissanceDeSite ? (
          <>
            <Input
              state={validationErrors['puissance'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['puissance']}
              label={`Puissance (en ${unitéPuissance}) (optionnel)`}
              nativeInputProps={{
                name: 'puissance',
                defaultValue: puissance,
                type: 'number',
                inputMode: 'decimal',
                pattern: '[0-9]+([.][0-9]+)?',
                step: 'any',
              }}
            />
            <Input
              state={validationErrors['puissanceDeSite'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['puissanceDeSite']}
              label={`Puissance de site (en ${unitéPuissance}) ${infosCahierDesChargesPuissanceDeSite === 'optionnel' ? '(optionnel)' : ''}`}
              nativeInputProps={{
                name: 'puissanceDeSite',
                defaultValue: puissanceDeSite,
                type: 'number',
                inputMode: 'decimal',
                pattern: '[0-9]+([.][0-9]+)?',
                step: 'any',
              }}
            />
          </>
        ) : (
          <Input
            state={validationErrors['puissance'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['puissance']}
            label={`Puissance (en ${unitéPuissance})`}
            nativeInputProps={{
              name: 'puissance',
              defaultValue: puissance,
              required: true,
              'aria-required': true,
              type: 'number',
              inputMode: 'decimal',
              pattern: '[0-9]+([.][0-9]+)?',
              step: 'any',
            }}
          />
        )}
        <Input
          textArea
          label={`Raison (optionnel)`}
          id="raison"
          hintText="Veuillez détailler les raisons ayant conduit au changement de puissance."
          nativeTextAreaProps={{ name: 'raison', required: false, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
      </div>
    </Form>
  );
};
