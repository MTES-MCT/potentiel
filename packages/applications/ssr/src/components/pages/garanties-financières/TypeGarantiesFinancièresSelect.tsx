import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Candidature } from '@potentiel-domain/candidature';

import { ValidationErrors } from '@/utils/formAction';

export type TypeGarantiesFinancièresSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  validationErrors: ValidationErrors;
  typeGarantiesFinancièresActuel?: Candidature.TypeGarantiesFinancières.RawType;
  dateÉchéanceActuelle?: Iso8601DateTime;
  typesGarantiesFinancières: Array<{
    label: string;
    value: Candidature.TypeGarantiesFinancières.RawType;
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
        state={validationErrors['type'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['type']}
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
          state={validationErrors['dateEcheance'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateEcheance']}
          hintText={<div className="fr-hint-text">"Date d'échéance obligatoire"</div>}
          disabled={disabled}
        />
      )}
    </>
  );
};
