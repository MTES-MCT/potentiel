import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ValidationErrors } from '@/utils/formAction';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { getGarantiesFinancièresAttestationLabel } from './_helpers/getGarantiesFinancièresAttestationLabel';
import { getGarantiesFinancièresDateLabel } from './_helpers/getGarantiesFinancièresDateLabel';

export type GarantiesFinancièresFormInputsProps = {
  id: string;
  name: string;
  label?: string;
  validationErrors: ValidationErrors;
  actuelles?: Partial<
    PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>
  >;
  typesGarantiesFinancières: Array<{
    label: string;
    value: Candidature.TypeGarantiesFinancières.RawType;
  }>;
};

export const GarantiesFinancièresFormInputs: FC<GarantiesFinancièresFormInputsProps> = ({
  id,
  name,
  label = 'Type des garanties financières',
  validationErrors,
  actuelles,
  typesGarantiesFinancières,
}) => {
  const gfActuelles = actuelles?.garantiesFinancières
    ? Lauréat.GarantiesFinancières.GarantiesFinancières.bind(actuelles.garantiesFinancières)
    : undefined;
  const [typeSélectionné, setTypeSélectionné] = useState<
    Candidature.TypeGarantiesFinancières.RawType | undefined
  >(gfActuelles?.type.type);

  return (
    <>
      <Select
        id={id}
        label={label}
        nativeSelectProps={{
          name,
          value: typeSélectionné,
          onChange: (e) => setTypeSélectionné(e.target.value),
          'aria-required': true,
          required: true,
        }}
        placeholder="Sélectionnez le type de garanties financières"
        options={typesGarantiesFinancières}
        state={validationErrors['type'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['type']}
      />

      {typeSélectionné === 'avec-date-échéance' && (
        <InputDate
          label="Date d'échéance"
          name="dateEcheance"
          required
          defaultValue={
            gfActuelles?.estAvecDateÉchéance() ? gfActuelles.dateÉchéance.formatter() : undefined
          }
          state={validationErrors['dateEcheance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateEcheance']}
        />
      )}

      <InputDate
        label={
          typeSélectionné
            ? getGarantiesFinancièresDateLabel(typeSélectionné)
            : "Date de prise d'effet"
        }
        name="dateConstitution"
        max={DateTime.now().formatter()}
        defaultValue={gfActuelles?.constitution?.date.formatter()}
        required
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadNewOrModifyExistingDocument
        label={
          typeSélectionné
            ? getGarantiesFinancièresAttestationLabel(typeSélectionné)
            : 'Attestation de constitution des garanties financières'
        }
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
        documentKeys={
          actuelles?.document ? [DocumentProjet.bind(actuelles.document).formatter()] : []
        }
      />
    </>
  );
};
