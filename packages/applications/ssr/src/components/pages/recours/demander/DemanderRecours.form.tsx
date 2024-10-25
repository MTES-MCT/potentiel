'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDocument } from '@/components/atoms/form/InputDocument';
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
      actions={<SubmitButton>Demander le recours</SubmitButton>}
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

      <InputDocument
        label={'Pièce justificative'}
        id="pieceJustificative"
        name="pieceJustificative"
        required
        formats={['pdf']}
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};
