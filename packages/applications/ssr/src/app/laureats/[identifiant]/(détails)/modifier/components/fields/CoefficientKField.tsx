import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { LinkedValuesButton } from '../LinkedValuesButton';

import { CandidatureFieldProps } from './CandidatureField';

export const CoefficientKField = ({
  candidature,
  name,
  label,
  validationErrors,
}: CandidatureFieldProps<boolean>) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{label}</div>
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue ? 'true' : 'false'}
          disabled={candidatureValue === candidature}
        />
        <Select
          className="w-full"
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeSelectProps={{
            defaultValue: candidatureValue ? 'true' : 'false',
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value === 'true');
            },
          }}
          options={[
            { label: 'Oui', value: 'true' },
            { label: 'Non', value: 'false' },
          ]}
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
            value: candidatureValue ? 'Oui' : 'Non',
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};
