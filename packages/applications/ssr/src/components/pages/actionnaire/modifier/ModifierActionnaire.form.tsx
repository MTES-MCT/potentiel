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

export const ModifierActionnaireForm: FC<ModifierActionnaireFormProps> = ({
  identifiantProjet,
  actionnaire,
  hasToUploadDocument,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierActionnaireFormKeys>
  >({});
  const [piècesJustificatives, setPiècesJustificatives] = useState<Array<string>>([]);

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
            Retour à la page projet
          </Button>
          <SubmitButton
            disabledCondition={() =>
              (hasToUploadDocument && !piècesJustificatives.length) ||
              Object.keys(validationErrors).length > 0
            }
          >
            Modifier
          </SubmitButton>
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
          hintText="Veuillez détailler les raisons ayant conduit à la modification de l'actionnariat."
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label="Pièce justificative"
          name="piecesJustificatives"
          hintText="Joindre la copie des statuts de la société à jour et le(s) justificatif(s) relatif(s) à la composition de l’actionnariat"
          required={hasToUploadDocument}
          formats={['pdf']}
          multiple
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
          onChange={(piècesJustificatives) => {
            delete validationErrors['piecesJustificatives'];
            setPiècesJustificatives(piècesJustificatives);
          }}
        />
      </div>
    </Form>
  );
};
