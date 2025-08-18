import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Candidature } from '@potentiel-domain/projet';

import { getActionnariatTypeLabel } from '@/app/_helpers';

import { LinkedValuesButton } from '../LinkedValuesButton';
import { FieldValidationErrors } from '../../ModifierLauréat.form';

type ActionnariatFieldProps = {
  candidature: string;
  name: 'actionnariat';
  label: string;
  validationErrors: FieldValidationErrors;
  typesActionnariat: Candidature.TypeActionnariat.RawType[];
};

export const ActionnariatField = ({
  candidature,
  typesActionnariat,
  name,
  validationErrors,
  label,
}: ActionnariatFieldProps) => {
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
            onChange: (ev) => {
              setCandidatureValue(ev.target.value);
            },
          }}
          options={[
            { label: 'Aucun', value: '' },
            ...typesActionnariat.map((type) => ({
              label: getActionnariatTypeLabel(type),
              value: type,
            })),
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
            value:
              candidatureValue &&
              getActionnariatTypeLabel(
                Candidature.TypeActionnariat.convertirEnValueType(candidatureValue).type,
              ),
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};
