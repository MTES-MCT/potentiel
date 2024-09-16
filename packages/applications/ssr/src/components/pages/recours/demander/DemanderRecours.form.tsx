'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { demanderRecoursAction } from './demanderRecours.action';

export type DemanderRecoursFormProps = {
  identifiantProjet: string;
};

export const DemanderRecoursForm: FC<DemanderRecoursFormProps> = ({ identifiantProjet }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      action={demanderRecoursAction}
      method="POST"
      encType="multipart/form-data"
      onSuccess={() => router.push(Routes.Recours.détail(identifiantProjet))}
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
        state={validationErrors.includes('raison') ? 'error' : 'default'}
        stateRelatedMessage="Raison à préciser"
      />

      <UploadDocument
        label={'Pièce justificative'}
        id="pieceJustificative"
        name="pieceJustificative"
        required
        state={validationErrors.includes('pieceJustificative') ? 'error' : 'default'}
      />
    </Form>
  );
};
