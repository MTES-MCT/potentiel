'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerChangementInstallateurAction,
  EnregistrerChangementInstallateurFormKeys,
} from './enregistrerChangementInstallateur.action';
import { EnregistrerChangementInstallateurPageProps } from './EnregistrerChangementInstallateur.page';

export type EnregistrerChangementInstallateurFormProps = EnregistrerChangementInstallateurPageProps;

export const EnregistrerChangementInstallateurForm: FC<
  EnregistrerChangementInstallateurFormProps
> = ({ identifiantProjet, installateur }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerChangementInstallateurFormKeys>
  >({});

  return (
    <Form
      action={enregistrerChangementInstallateurAction}
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
      {installateur !== '' && <div>Installateur actuel : {installateur}</div>}
      <div className="flex flex-col gap-6">
        <Input
          state={validationErrors['installateur'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['installateur']}
          label="Nouvel installateur"
          className="flex-1 w-fit"
          nativeInputProps={{
            type: 'text',
            name: 'installateur',
            required: true,
            'aria-required': true,
          }}
        />

        <Input
          textArea
          label="Raison (optionnel)"
          id="raison"
          hintText="Veuillez détailler les raisons ayant conduit au changement."
          nativeTextAreaProps={{
            name: 'raison',
            required: false,
            'aria-required': false,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label="Pièce justificative (optionnel)"
          name="piecesJustificatives"
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
