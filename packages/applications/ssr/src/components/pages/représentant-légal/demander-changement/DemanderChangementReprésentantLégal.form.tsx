'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  demanderChangementReprésentantLégalAction,
  DemanderChangementReprésentantLégalFormKeys,
} from './demanderChangementReprésentantLégal.action';

export type DemanderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const DemanderChangementReprésentantLégalForm: FC<
  DemanderChangementReprésentantLégalFormProps
> = ({ identifiantProjet }) => {
  const [, selectTypeDePersonne] = useState('');

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementReprésentantLégalFormKeys>
  >({});

  return (
    <Form
      action={demanderChangementReprésentantLégalAction}
      method="POST"
      encType="multipart/form-data"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Demander le recours</SubmitButton>}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <SelectNext
        label="Choisir le type de personne du représentant légal"
        placeholder={`Sélectionner un projet`}
        state={validationErrors['typeDePersonne'] ? 'error' : 'default'}
        stateRelatedMessage="La sélection du projet est obligatoire"
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            selectTypeDePersonne(value);
          },
        }}
        options={['Personne physique', 'Personne morale', 'Collectivité', 'Autre'].map((type) => ({
          label: type,
          value: type,
        }))}
      />

      <Input
        textArea
        label="Nom du représentant légal"
        id="nomRepresentantLegal"
        hintText="Veuillez préciser le nom du nouveau représentant légal de votre projet"
        nativeTextAreaProps={{
          name: 'nomRepresentantLegal',
          required: true,
          'aria-required': true,
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />

      <UploadDocument
        label={'Pièce justificative'}
        id="pieceJustificative"
        name="pieceJustificative"
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};
