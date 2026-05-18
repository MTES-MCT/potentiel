'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { type DemanderRecoursFormKeys, demanderRecoursAction } from './demanderRecours.action';

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
        submitLabel: 'Demander',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Veuillez détailler les raisons de ce recours"
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
