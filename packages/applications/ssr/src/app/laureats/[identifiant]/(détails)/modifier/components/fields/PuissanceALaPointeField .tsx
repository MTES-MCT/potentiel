import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useState } from 'react';

import { LinkedValuesButton } from '../LinkedValuesButton';
import { FieldValidationErrors } from '../../ModifierLauréat.form';

type PuissanceALaPointeFieldProps = {
  candidature: boolean;
  name: 'puissanceALaPointe';
  label: string;
  validationErrors: FieldValidationErrors;
  required?: boolean;
};

export const PuissanceALaPointeField = ({
  candidature,
  validationErrors,
  name,
  label,
  required,
}: PuissanceALaPointeFieldProps) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={`${candidatureValue}`}
          disabled={candidatureValue === candidature}
        />
        <Checkbox
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          options={[
            {
              label: required ? label : `${label} (optionnel)`,
              nativeInputProps: {
                defaultChecked: candidatureValue,
                onClick: () => setCandidatureValue(!candidatureValue),
                required,
                'aria-required': required,
              },
            },
          ]}
        />
      </div>
      <div className="flex-[2] flex px-2 justify-between items-center">
        <Checkbox
          state={validationErrors['candidature.puissanceALaPointe'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['candidature.puissanceALaPointe']}
          disabled
          options={[
            {
              label: required ? label : `${label} (optionnel)`,
              nativeInputProps: {
                value: 'true',
                defaultChecked: candidature,
                required,
                'aria-required': required,
              },
            },
          ]}
        />
        <LinkedValuesButton isLocked />
      </div>
    </div>
  );
};
