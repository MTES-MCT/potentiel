'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
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
      actionButtons={{
        submitLabel: 'Demander',
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Veuillez détailler les raisons de cet abandon (contexte, facteurs extérieurs, etc.)"
        nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        hintText="Veuillez joindre vos justificatifs"
        name="pieceJustificative"
        formats={['pdf']}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};
