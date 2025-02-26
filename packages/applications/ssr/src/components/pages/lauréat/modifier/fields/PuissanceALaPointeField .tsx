import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useState } from 'react';

import { CandidatureFieldProps, LinkedValuesButton } from './ModifierLauréatFields';

export const PuissanceALaPointeField = ({
  candidature,
  validationErrors,
  name,
  label,
}: CandidatureFieldProps<boolean>) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold"></div>
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
              label: label,
              nativeInputProps: {
                defaultChecked: candidatureValue,
                onClick: () => setCandidatureValue(!candidatureValue),
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
              label: label,
              nativeInputProps: {
                value: 'true',
                defaultChecked: candidature,
              },
            },
          ]}
        />
        <LinkedValuesButton isLocked />
      </div>
    </div>
  );
};
