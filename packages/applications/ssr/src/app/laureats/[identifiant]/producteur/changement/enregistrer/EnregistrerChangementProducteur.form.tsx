'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerChangementProducteurAction,
  EnregistrerChangementProducteurFormKeys,
} from './enregistrerChangementProducteur.action';
import { EnregistrerChangementProducteurPageProps } from './EnregistrerChangementProducteur.page';

export type EnregistrerChangementProducteurFormProps = EnregistrerChangementProducteurPageProps;

export const EnregistrerChangementProducteurForm: FC<EnregistrerChangementProducteurFormProps> = ({
  identifiantProjet,
  producteur,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerChangementProducteurFormKeys>
  >({});

  return (
    <Form
      action={enregistrerChangementProducteurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Confirmer',
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
        <div className="flex flex-col gap-2">
          <Input
            state={validationErrors['producteur'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['producteur']}
            label="Producteur"
            className="lg:w-1/2"
            nativeInputProps={{
              name: 'producteur',
              defaultValue: producteur,
              required: true,
              'aria-required': true,
            }}
          />
        </div>
        <Input
          textArea
          label="Raison (optionnel)"
          id="raison"
          className="lg:w-1/2"
          hintText="Veuillez détailler les raisons de ce changement"
          nativeTextAreaProps={{
            name: 'raison',
            required: false,
            'aria-required': false,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label={'Pièce justificative'}
          name="piecesJustificatives"
          hintText="Joindre les statuts mis à jour"
          required={true}
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
