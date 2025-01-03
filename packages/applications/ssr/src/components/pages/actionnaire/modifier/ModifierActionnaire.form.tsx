'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierActionnaireAction,
  ModifierActionnaireFormKeys,
} from './modifierActionnaire.action';
import { ModifierActionnairePageProps } from './ModifierActionnaire.page';

export type ModifierActionnaireFormProps = ModifierActionnairePageProps;

// TODO: reprendre le wording cf nouveau ticket
export const ModifierActionnaireForm: FC<ModifierActionnaireFormProps> = ({
  identifiantProjet,
  actionnaire,
  hasToUploadDocument,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierActionnaireFormKeys>
  >({});

  return (
    <Form
      action={modifierActionnaireAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour sur le projet
          </Button>
          <SubmitButton>Modifier l'actionnaire</SubmitButton>
        </>
      }
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
          label="Nouvel actionnaire"
          nativeInputProps={{
            name: 'actionnaire',
            defaultValue: actionnaire,
            required: true,
            'aria-required': true,
          }}
        />
        <UploadNewOrModifyExistingDocument
          label={`Pièce justificative${hasToUploadDocument ? '' : ' (optionnel)'}`}
          name="pieceJustificative"
          formats={['pdf']}
          required={hasToUploadDocument}
          state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['pieceJustificative']}
        />
      </div>
    </Form>
  );
};
