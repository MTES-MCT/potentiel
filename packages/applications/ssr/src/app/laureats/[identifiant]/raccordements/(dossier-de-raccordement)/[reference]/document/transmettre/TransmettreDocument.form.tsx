'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { type FC, useState } from 'react';

import { Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type TransmettreDocumentFormKeys,
  transmettreDocumentAction,
} from './transmettreDocument.action';

export type TransmettreDocumentFormProps = {
  identifiantProjet: string;
  referenceDossierRaccordement: string;
};

export const TransmettreDocumentForm: FC<TransmettreDocumentFormProps> = ({
  identifiantProjet,
  referenceDossierRaccordement,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDocumentFormKeys>
  >({});
  const [typeDocument, setTypeDocument] =
    useState<Lauréat.Raccordement.TypeDocumentsRaccordement.RawType>(
      'proposition-technique-et-financière',
    );

  // pas toute les options en fonction
  const typeOptions = Lauréat.Raccordement.TypeDocumentsRaccordement.type.map((t) => ({
    label: t
      .split('-')
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(' '),
    value: t,
  }));

  return (
    <Form
      heading="Transmettre la proposition technique et financière"
      action={transmettreDocumentAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Transmettre',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={referenceDossierRaccordement} />

      <Select
        state={validationErrors['type'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['type']}
        label="Type"
        options={typeOptions}
        nativeSelectProps={{
          name: 'type',
          defaultValue: typeDocument,
          required: true,
          'aria-required': true,
          onChange: (e) =>
            setTypeDocument(
              e.target.value as Lauréat.Raccordement.TypeDocumentsRaccordement.RawType,
            ),
        }}
      />

      <Input
        label="Date de signature"
        state={validationErrors['dateSignature'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateSignature']}
        nativeInputProps={{
          type: 'date',
          name: 'dateSignature',
          max: new Date().toISOString().split('T').shift(),
          required: true,
          'aria-required': true,
        }}
      />

      <UploadNewOrModifyExistingDocument
        label="Proposition technique et financière signée"
        name="documentSigné"
        required
        formats={['pdf']}
        state={validationErrors['documentSigné'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['documentSigné']}
      />
    </Form>
  );
};
