'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import {
  modifierInstallateurAction,
  ModifierInstallateurFormKeys,
} from './modifierInstallateur.action';

export type ModifierInstallateurFormProps =
  PlainType<Lauréat.Installation.ConsulterInstallateurReadModel>;

export const ModifierInstallateurForm: FC<ModifierInstallateurFormProps> = ({
  identifiantProjet,
  installateur,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierInstallateurFormKeys>
  >({});

  return (
    <Form
      action={modifierInstallateurAction}
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

      <Input
        state={validationErrors['installateur'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['installateur']}
        label="Identité de l'installateur"
        nativeInputProps={{
          name: 'installateur',
          defaultValue: installateur,
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
        label="Pièce justificative (optionnel)"
        name="piecesJustificatives"
        hintText="Si pertinent, veuillez joindre vos justificatifs"
        multiple
        formats={['pdf']}
        state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['piecesJustificatives']}
      />
    </Form>
  );
};
