'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierActionnaireAction,
  ModifierActionnaireFormKeys,
} from './modifierActionnaire.action';

export type ModifierActionnaireFormProps = PlainType<
  Pick<Lauréat.Actionnaire.ConsulterActionnaireReadModel, 'actionnaire' | 'identifiantProjet'>
>;

export const ModifierActionnaireForm: FC<ModifierActionnaireFormProps> = ({
  identifiantProjet,
  actionnaire,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierActionnaireFormKeys>
  >({});

  return (
    <Form
      action={modifierActionnaireAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
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
          state={validationErrors['actionnaire'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['actionnaire']}
          label="Nouvelle société mère"
          nativeInputProps={{
            name: 'actionnaire',
            defaultValue: actionnaire,
            required: true,
            'aria-required': true,
          }}
        />
        <Input
          textArea
          label="Raison"
          id="raison"
          hintText="Veuillez détailler les raisons de ce changement"
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label={`Pièce(s) justificative(s) (optionnel)`}
          name="piecesJustificatives"
          hintText="Joindre la copie des statuts de la société à jour et le(s) justificatif(s) relatif(s) à la composition de l’actionnariat"
          formats={['pdf']}
          multiple
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
