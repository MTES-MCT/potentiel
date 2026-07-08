'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { type FC, useState } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

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
  availableTypes: Array<Lauréat.Raccordement.TypeDocumentsRaccordement.RawType>;
};

export const TransmettreDocumentForm: FC<TransmettreDocumentFormProps> = ({
  identifiantProjet,
  referenceDossierRaccordement,
  availableTypes,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDocumentFormKeys>
  >({});
  const [typeDocument, setTypeDocument] = useState<
    Lauréat.Raccordement.TypeDocumentsRaccordement.RawType | undefined
  >(availableTypes.length > 1 ? undefined : availableTypes[0]);
  const typeOptions = availableTypes.map((t) => ({
    label: t.split('-').join(' '),
    value: t,
  }));

  const documentLabel = typeOptions.find((t) => t.value === typeDocument)?.label;

  return (
    <Form
      heading={`Transmettre la ${documentLabel}`}
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
      <input type="hidden" name="type" value={typeDocument} />

      <Select
        state={validationErrors['type'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['type']}
        label="Type"
        options={typeOptions}
        disabled={availableTypes.length <= 1}
        nativeSelectProps={{
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
        label={`La ${documentLabel} signée`}
        name="documentSigné"
        required
        formats={['pdf']}
        state={validationErrors['documentSigné'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['documentSigné']}
      />
    </Form>
  );
};
