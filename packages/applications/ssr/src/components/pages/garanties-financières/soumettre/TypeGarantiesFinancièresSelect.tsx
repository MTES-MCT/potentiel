import React, { useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

type TypeGarantiesFinancières = '6 mois après achèvement' | 'consignation' | 'avec date d’échéance';

export type TypeGarantiesFinancièresSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  validationErrors: Array<string>;
  typeGarantiesFinancièresActuel?: TypeGarantiesFinancières;
};

export const TypeGarantiesFinancièresSelect = ({
  id,
  name,
  label = 'Type des garanties financières',
  disabled,
  validationErrors,
  typeGarantiesFinancièresActuel,
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

      {typeSélectionné && typeSélectionné === 'avec date d’échéance' && (
        <Input
          label="Date d'échéance"
          nativeInputProps={{
            type: 'date',
            name: 'dateEcheance',
            required: true,
            'aria-required': true,
          }}
          state={validationErrors.includes('dateEcheance') ? 'error' : 'default'}
          stateRelatedMessage="Date d'échéance obligatoire"
        />
      )}
    </>
  );
};
