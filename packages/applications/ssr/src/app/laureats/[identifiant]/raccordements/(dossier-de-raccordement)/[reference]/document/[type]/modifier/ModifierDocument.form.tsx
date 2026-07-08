'use client';

import { type FC, useState } from 'react';

import { type Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import type { ValidationErrors } from '@/utils/formAction';
import { type ModifierDocumentFormKeys, modifierDocumentAction } from './modifierDocument.action';

export type ModifierDocumentFormProps = {
  identifiantProjet: string;
  raccordement: {
    reference: string;
    document: {
      dateSignature: Iso8601DateTime;
      documentSignée: string;
      type: string;
    };
  };
};

export const ModifierDocumentForm: FC<ModifierDocumentFormProps> = ({
  identifiantProjet,
  raccordement: {
    reference,
    document: { dateSignature, documentSignée, type },
  },
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierDocumentFormKeys>
  >({});

  return (
    <Form
      action={modifierDocumentAction}
      heading={`Modifier la ${type.split('-').join(' ')}`}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <div>
        Référence du dossier de raccordement : <strong>{reference}</strong>
      </div>

      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossierRaccordement" value={reference} />
      <input type="hidden" name="type" value={type} />

      <InputDate
        id="dateSignature"
        label="Date de signature"
        name="dateSignature"
        max={now()}
        defaultValue={dateSignature}
        required
        state={validationErrors['dateSignature'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateSignature']}
        small
      />

      <UploadNewOrModifyExistingDocument
        label="Document signé"
        name="documentSigné"
        required
        formats={['pdf']}
        state={validationErrors['documentSigné'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['documentSigné']}
        documentKeys={[documentSignée]}
      />
    </Form>
  );
};
