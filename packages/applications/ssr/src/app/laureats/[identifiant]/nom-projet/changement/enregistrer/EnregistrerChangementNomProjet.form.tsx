'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerChangementNomProjetAction,
  ModifierNomProjetFormKeys,
} from './enregistrerChangementNomProjet.action';

export type EnregistrerChangementNomProjetFormProps = {
  nomProjet: string;
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const EnregistrerChangementNomProjetForm: FC<EnregistrerChangementNomProjetFormProps> = ({
  identifiantProjet,
  nomProjet,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierNomProjetFormKeys>
  >({});

  return (
    <Form
      action={enregistrerChangementNomProjetAction}
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

      <div className="flex flex-col gap-4">
        <Input
          state={validationErrors['nomProjet'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['nomProjet']}
          label="Nouveau nom du projet"
          className="lg:w-1/2"
          nativeInputProps={{
            name: 'nomProjet',
            defaultValue: nomProjet,
            required: true,
            'aria-required': true,
          }}
        />
        <Input
          textArea
          label="Raison"
          id="raison"
          className="lg:w-1/2"
          hintText="Veuillez détailler les raisons de ce changement"
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />

        <UploadNewOrModifyExistingDocument
          label="Pièce justificative"
          name="piecesJustificatives"
          hintText="Veuillez joindre vos justificatifs"
          formats={['pdf']}
          required
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
