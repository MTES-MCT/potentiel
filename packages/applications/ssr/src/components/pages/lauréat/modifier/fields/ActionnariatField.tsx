import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Candidature } from '@potentiel-domain/candidature';

import { getActionnariatTypeLabel } from '../../../candidature/helpers/getActionnariatTypeLabel';

import { CandidatureFieldProps, LinkedValuesButton } from './ModifierLauréatFields';

type Props = CandidatureFieldProps<string> & { isPPE2: boolean };

export const ActionnariatField = ({
  candidature,
  isPPE2,
  name,
  validationErrors,
  label,
}: Props) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const typesActionnariat = isPPE2
    ? Candidature.TypeActionnariat.ppe2Types
    : Candidature.TypeActionnariat.cre4Types;

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
              // TODO: remove https://github.com/codegouvfr/react-dsfr/issues/387
              selected: type === candidatureValue,
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
