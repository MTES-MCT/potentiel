import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Candidature } from '@potentiel-domain/candidature';

import { getTechnologieTypeLabel } from '../../../../candidature/helpers';
import { LinkedValuesButton } from '../LinkedValuesButton';
import { FieldValidationErrors } from '../../ModifierLauréat.form';

type TechnologieFieldProps = {
  candidature: string;
  name: 'technologie';
  label: string;
  validationErrors: FieldValidationErrors;
};

export const TechnologieField = ({
  candidature,
  name,
  label,
  validationErrors,
}: TechnologieFieldProps) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{label}</div>
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Select
          className="w-full"
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeSelectProps={{
            defaultValue: candidature,
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value);
            },
          }}
          options={Candidature.TypeTechnologie.types.map((type) => ({
            value: type,
            label: getTechnologieTypeLabel(type),
          }))}
        />
      </div>
      <div className="flex-[2] flex px-2">
        <Input
          className="w-full"
          disabled
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeInputProps={{
            value:
              candidatureValue &&
              getTechnologieTypeLabel(
                Candidature.TypeTechnologie.convertirEnValueType(candidatureValue).type,
              ),
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};
