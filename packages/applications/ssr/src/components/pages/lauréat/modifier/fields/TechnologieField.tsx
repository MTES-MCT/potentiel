import Select from '@codegouvfr/react-dsfr/SelectNext';
import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { Candidature } from '@potentiel-domain/candidature';

import { getTechnologieTypeLabel } from '../../../candidature/helpers';

type Props = {
  candidature: string;
};

export const TechnologieField = ({ candidature }: Props) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Technologie</div>
      <div className="flex-1 flex ">
        <input
          name={`candidature.technologie`}
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
          options={Candidature.TypeTechnologie.types.map((type) => ({
            value: type,
            label: getTechnologieTypeLabel(type),
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
              getTechnologieTypeLabel(
                Candidature.TypeTechnologie.convertirEnValueType(candidatureValue).type,
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
