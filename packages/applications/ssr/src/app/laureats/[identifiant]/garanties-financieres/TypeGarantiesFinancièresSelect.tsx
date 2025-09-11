import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { ValidationErrors } from '@/utils/formAction';
import { PlainType } from '@potentiel-domain/core';
import { InputDate } from '@/components/atoms/form/InputDate';

export type TypeGarantiesFinancièresSelectProps = {
  id: string;
  name: string;
  label?: string;
  validationErrors: ValidationErrors;
  garantiesFinancièresActuelles?: PlainType<Lauréat.GarantiesFinancières.GarantiesFinancières.ValueType>;
  typesGarantiesFinancières: Array<{
    label: string;
    value: Candidature.TypeGarantiesFinancières.RawType;
  }>;
};

export const TypeGarantiesFinancièresSelect: FC<TypeGarantiesFinancièresSelectProps> = ({
  id,
  name,
  label = 'Type des garanties financières',
  validationErrors,
  garantiesFinancièresActuelles,
  typesGarantiesFinancières,
}) => {
  const gfActuelles = garantiesFinancièresActuelles
    ? Lauréat.GarantiesFinancières.GarantiesFinancières.bind(garantiesFinancièresActuelles)
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
      {typeSélectionné === 'exemption' && (
        <InputDate
          label="Date de délibération"
          name="dateDeliberation"
          required
          defaultValue={
            gfActuelles?.estExemption() ? gfActuelles.dateDélibération.formatter() : undefined
          }
          state={validationErrors['dateEcheance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateEcheance']}
        />
      )}
    </>
  );
};
