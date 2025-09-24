'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  demanderChangementActionnaireAction,
  DemanderChangementActionnaireFormKeys,
} from './demanderChangementActionnaire.action';
import { DemanderChangementActionnairePageProps } from './DemanderChangementActionnaire.page';

export type DemanderChangementActionnaireFormProps = DemanderChangementActionnairePageProps;

export const DemanderChangementActionnaireForm: FC<DemanderChangementActionnaireFormProps> = ({
  identifiantProjet,
  actionnaire,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementActionnaireFormKeys>
  >({});

  return (
    <Form
      action={demanderChangementActionnaireAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Demander le changement',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
          label: 'Retour à la page projet',
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
          hintText="Si le changement d'actionnaire(s) n'entraîne pas le changement de la société mère, veuillez laisser la société mère actuelle"
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
          hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant conduit au changement d'actionnaire(s)."
          nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label="Pièce(s) justificative(s)"
          name="piecesJustificatives"
          hintText="Joindre la copie des statuts de la société à jour et le(s) justificatif(s) relatif(s) à la composition de l’actionnariat"
          required
          formats={['pdf']}
          multiple
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
