import React, { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

export type TypeGarantiesFinancièresSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  validationErrors: Array<string>;
  typeGarantiesFinancièresActuel?: GarantiesFinancières.TypeGarantiesFinancières.RawType;
  dateÉchéanceActuelle?: Iso8601DateTime;
  typesGarantiesFinancières: Array<{
    label: string;
    value: GarantiesFinancières.TypeGarantiesFinancières.RawType;
  }>;
};

export const TypeGarantiesFinancièresSelect: FC<TypeGarantiesFinancièresSelectProps> = ({
  id,
  name,
  label = 'Type des garanties financières',
  disabled,
  validationErrors,
  typeGarantiesFinancièresActuel,
  typesGarantiesFinancières,
  dateÉchéanceActuelle,
}) => {
  const [typeSélectionné, setTypeSélectionné] = useState<
    TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel']
  >(typeGarantiesFinancièresActuel);

  return (
    <>
      <Select
        id={id}
        label={label}
        nativeSelectProps={{
          name,
          defaultValue:
            typeGarantiesFinancièresActuel &&
            ['consignation', 'avec-date-échéance', 'six-mois-après-achèvement'].includes(
              typeGarantiesFinancièresActuel,
            )
              ? typeGarantiesFinancièresActuel
              : undefined,
          onChange: (e) => setTypeSélectionné(e.target.value),
          'aria-required': true,
          required: true,
        }}
        placeholder="Sélectionnez le type de garanties financières"
        options={[...typesGarantiesFinancières]}
        state={validationErrors.includes('type') ? 'error' : 'default'}
        stateRelatedMessage="Type de garanties financières obligatoire"
        disabled={disabled}
      />

      {disabled && <input type="hidden" name={name} value={typeGarantiesFinancièresActuel} />}

      {typeSélectionné === 'avec-date-échéance' && (
        <Input
          label="Date d'échéance"
          nativeInputProps={{
            type: 'date',
            name: 'dateEcheance',
            required: true,
            'aria-required': true,
            defaultValue: dateÉchéanceActuelle,
          }}
          state={validationErrors.includes('dateEcheance') ? 'error' : 'default'}
          stateRelatedMessage="Date d'échéance obligatoire"
          disabled={disabled}
        />
      )}
    </>
  );
};
