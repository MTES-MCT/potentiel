'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import { demanderAbandonAction, DemanderAbandonFormKeys } from './demanderAbandon.action';

export type DemanderAbandonFormProps = {
  identifiantProjet: string;
};

export const DemanderAbandonForm: FC<DemanderAbandonFormProps> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderAbandonFormKeys>
  >({});
  return (
    <Form
      action={demanderAbandonAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Demander l'abandon</SubmitButton>}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Pour faciliter le traitement de votre demande, veuillez détailler les raisons ayant
                conduit à cet abandon (contexte, facteurs extérieurs, etc.)."
        nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        name="pieceJustificative"
        formats={['pdf']}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};
