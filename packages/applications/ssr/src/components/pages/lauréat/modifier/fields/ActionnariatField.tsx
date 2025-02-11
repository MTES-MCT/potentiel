import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { Candidature } from '@potentiel-domain/candidature';

import { getActionnariatTypeLabel } from '../../../candidature/helpers/getActionnariatTypeLabel';

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
      <div className="flex-1 font-semibold">Type d'actionnariat</div>
      <div className="flex-1 flex ">
        <input
          name={`candidature.actionnariat`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Select
          label=""
          nativeSelectProps={{
            defaultValue: candidature,
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value);
            },
          }}
          options={typesActionnariat.map((type) => ({
            value: type,
            label: getActionnariatTypeLabel(type),
          }))}
        />
      </div>
      <div className="flex-1 flex flex-row gap-2 items-center">
        <Input
          disabled
          label=""
          nativeInputProps={{
            value:
              candidatureValue &&
              getActionnariatTypeLabel(
                Candidature.TypeActionnariat.convertirEnValueType(candidatureValue).type,
              ),
          }}
          addon={
            <Button
              type="button"
              iconId="fr-icon-lock-fill"
              title="Appliquer les changements au projet"
              disabled={true}
              nativeButtonProps={{ 'aria-label': 'Appliquer les changements au projet' }}
            />
          }
        />
      </div>
    </div>
  );
};
