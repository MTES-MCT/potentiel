'use client';

import { FC, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Période } from '@potentiel-domain/periode';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  corrigerCandidaturesParLotAction,
  CorrigerCandidaturesParLotFormKeys,
} from './CorrigerCandidaturesParLot.action';

export type CorrigerCandidaturesParLotFormProps = {
  périodes: PlainType<Période.ListerPériodeItemReadModel[]>;
};

export const CorrigerCandidaturesParLotForm: FC<CorrigerCandidaturesParLotFormProps> = ({
  périodes,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerCandidaturesParLotFormKeys>
  >({});

  const searchParams = useSearchParams();

  const getDefaultPériode = () => {
    const appelOffre = searchParams.get('appelOffre');
    const période = searchParams.get('periode');

    if (appelOffre && période) {
      return Période.IdentifiantPériode.bind({ appelOffre, période });
    }

    return périodes.length === 1
      ? Période.IdentifiantPériode.bind(périodes[0].identifiantPériode)
      : undefined;
  };

  const [période, setPériode] = useState<Période.IdentifiantPériode.ValueType | undefined>(
    getDefaultPériode,
  );

  return (
    <>
      <div className="flex items-start flex-col mb-6">
        <Select
          label="Période"
          state={période ? 'default' : 'info'}
          className="mb-4"
          stateRelatedMessage={période ? undefined : `Veuillez saisir une période`}
          options={périodes
            .map(({ identifiantPériode }) => Période.IdentifiantPériode.bind(identifiantPériode))
            .map((identifiantPériode) => ({
              label: `${identifiantPériode.appelOffre} - P${identifiantPériode.période}`,
              value: identifiantPériode.formatter(),
            }))}
          nativeSelectProps={{
            name: 'periode',
            value: période?.formatter(),
            onChange: ({ target: { value } }) =>
              setPériode(Période.IdentifiantPériode.convertirEnValueType(value)),
            required: true,
          }}
        />
      </div>
      <Form
        action={corrigerCandidaturesParLotAction}
        heading="Corriger un import de candidatures"
        pendingModal={{
          id: 'form-corriger-candidatures',
          title: 'Corriger un import de candidat(s)',
          children: 'Correction des candidats en cours...',
        }}
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        actionButtons={{
          submitLabel: 'Corriger',
        }}
      >
        <input type="hidden" name="appelOffre" value={période?.appelOffre} />
        <input type="hidden" name="periode" value={période?.période} />

        <UploadNewOrModifyExistingDocument
          label="Fichier CSV"
          name="fichierCorrectionCandidatures"
          required
          formats={['csv']}
          state={validationErrors['fichierCorrectionCandidatures'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['fichierCorrectionCandidatures']}
        />
      </Form>
    </>
  );
};
