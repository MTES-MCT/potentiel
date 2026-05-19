'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import type { EnregistrerChangementProducteurPageProps } from './EnregistrerChangementProducteur.page';
import {
  type EnregistrerChangementProducteurFormKeys,
  enregistrerChangementProducteurAction,
} from './enregistrerChangementProducteur.action';

export type EnregistrerChangementProducteurFormProps = EnregistrerChangementProducteurPageProps;

export const EnregistrerChangementProducteurForm: FC<EnregistrerChangementProducteurFormProps> = ({
  identifiantProjet,
  producteur,
  numéroIdentification,
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
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-6">
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
        <Input
          state={validationErrors['siret'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['siret']}
          hintText="Constitué de 14 chiffres"
          label="Numéro SIRET (optionnel)"
          nativeInputProps={{
            name: 'siret',
            defaultValue: numéroIdentification?.siret,
            required: false,
            'aria-required': false,
          }}
        />
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
