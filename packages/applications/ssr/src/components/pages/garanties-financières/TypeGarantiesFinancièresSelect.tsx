import React, { useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

import { formatDateForInput } from '@/utils/formatDateForInput';

export type TypeGarantiesFinancières =
  | '6 mois après achèvement'
  | 'consignation'
  | 'avec date d’échéance';

export type GarantiesFinancières = {
  dateConsitution: string;
  attestationConstitution: string;
} & (
  | {
      type: Exclude<TypeGarantiesFinancières, 'avec date d’échéance'>;
    }
  | {
      type: Extract<TypeGarantiesFinancières, 'avec date d’échéance'>;
      dateÉchéance: string;
    }
);

export type TypeGarantiesFinancièresSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  validationErrors: Array<string>;
  typeGarantiesFinancièresActuel?: TypeGarantiesFinancières;
  dateÉchéanceActuelle?: string;
};

export const TypeGarantiesFinancièresSelect = ({
  id,
  name,
  label = 'Type des garanties financières',
  disabled,
  validationErrors,
  typeGarantiesFinancièresActuel,
  dateÉchéanceActuelle,
}: TypeGarantiesFinancièresSelectProps) => {
  const [typeSélectionné, setTypeSélectionné] = useState(typeGarantiesFinancièresActuel);

  return (
    <>
      <Select
        id={id}
        label={label}
        nativeSelectProps={{
          name,
          defaultValue: typeGarantiesFinancièresActuel,
          onChange: (e) => setTypeSélectionné(e.target.value as TypeGarantiesFinancières),
          'aria-required': true,
          required: true,
        }}
        placeholder="Sélectionnez le type de garanties financières"
        options={[
          {
            label: '6 mois après achèvement',
            value: '6 mois après achèvement',
          },
          {
            label: 'Consignation',
            value: 'consignation',
          },
          {
            label: "Avec date d'échéance",
            value: 'avec date d’échéance',
          },
        ]}
        state={validationErrors.includes('typeGarantiesFinancieres') ? 'error' : 'default'}
        stateRelatedMessage="Type de garanties financières obligatoire"
        disabled={disabled}
      />

      {disabled && <input type="hidden" name={name} value={typeGarantiesFinancièresActuel} />}

      {typeSélectionné === 'avec date d’échéance' && (
        <Input
          label="Date d'échéance"
          nativeInputProps={{
            type: 'date',
            name: 'dateEcheance',
            required: true,
            'aria-required': true,
            defaultValue: dateÉchéanceActuelle
              ? formatDateForInput(dateÉchéanceActuelle)
              : undefined,
          }}
          state={validationErrors.includes('dateEcheance') ? 'error' : 'default'}
          stateRelatedMessage="Date d'échéance obligatoire"
          disabled={disabled}
        />
      )}
    </>
  );
};
