'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import { demanderRecoursAction, DemanderRecoursFormKeys } from './demanderRecours.action';

export type DemanderRecoursFormProps = {
  identifiantProjet: string;
};

export const DemanderRecoursForm: FC<DemanderRecoursFormProps> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderRecoursFormKeys>
  >({});

  return (
    <Form
      action={demanderRecoursAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Demander le recours',
        back: {
          href: Routes.Projet.details(identifiantProjet),
          label: 'Retour au projet',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant
                conduit au recours."
        nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label={'Pièce justificative'}
        name="pieceJustificative"
        required
        formats={['pdf']}
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};
