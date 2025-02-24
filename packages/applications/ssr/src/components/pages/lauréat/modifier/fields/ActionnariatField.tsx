import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Candidature } from '@potentiel-domain/candidature';

import { getActionnariatTypeLabel } from '../../../candidature/helpers/getActionnariatTypeLabel';

import { LinkedValuesButton } from './ModifierLauréatFields';

type Props = {
  candidature?: string;
  isPPE2: boolean;
};

export const ActionnariatField = ({ candidature, isPPE2 }: Props) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const typesActionnariat = isPPE2
    ? Candidature.TypeActionnariat.ppe2Types
    : Candidature.TypeActionnariat.cre4Types;

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Type d'actionnariat (optionnel)</div>
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.actionnariat`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Select
          className="w-full"
          label=""
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
