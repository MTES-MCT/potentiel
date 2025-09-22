'use client';

import { useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { FieldValidationErrors } from '../../ModifierLauréat.form';
import { LinkedValuesButton } from '../LinkedValuesButton';

type InstallationAvecDispositifDeStockageFieldProps = {
  candidature: boolean;
  lauréat: boolean;
  estEnCoursDeModification?: boolean;
  validationErrors: FieldValidationErrors;
};

export const InstallationAvecDispositifDeStockageField = ({
  candidature,
  lauréat,
  estEnCoursDeModification,
  validationErrors,
}: InstallationAvecDispositifDeStockageFieldProps) => {
  const [linked, setLinked] = useState(candidature === lauréat && !estEnCoursDeModification);
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const [lauréatValue, setLauréatValue] = useState(lauréat);

  const onButtonClick = () => {
    setLinked((l) => !l);
    setLauréatValue(candidatureValue);
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Dispositif de stockage</div>
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.installationAvecDispositifDeStockage`}
          type="hidden"
          value={candidatureValue ? 'true' : 'false'}
          disabled={candidatureValue === candidature}
        />
        <Select
          className="w-full"
          label=""
          state={
            validationErrors[`candidature.installationAvecDispositifDeStockage`]
              ? 'error'
              : 'default'
          }
          stateRelatedMessage={validationErrors[`candidature.installationAvecDispositifDeStockage`]}
          nativeSelectProps={{
            value: candidatureValue ? 'true' : 'false',
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value === 'true');
              if (linked) {
                setLauréatValue(ev.target.value === 'true');
              }
            },
          }}
          options={[
            { label: 'Avec', value: 'true' },
            { label: 'Sans', value: 'false' },
          ]}
        />
      </div>
      <div className="flex-[2] flex px-2 ">
        <input
          name={`laureat.installationAvecDispositifDeStockage`}
          type="hidden"
          value={lauréatValue ? 'true' : 'false'}
          disabled={lauréatValue === lauréat}
        />
        <Select
          className="w-full "
          style={{ marginBottom: 0 }}
          label=""
          disabled={estEnCoursDeModification || linked}
          state={
            validationErrors[`laureat.installationAvecDispositifDeStockage`] ? 'error' : 'default'
          }
          stateRelatedMessage={validationErrors[`laureat.installationAvecDispositifDeStockage`]}
          nativeSelectProps={{
            value: lauréatValue ? 'true' : 'false',
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setLauréatValue(ev.target.value === 'true');
            },
          }}
          options={[
            { label: 'Avec', value: 'true' },
            { label: 'Sans', value: 'false' },
          ]}
        />
        <LinkedValuesButton
          linked={linked}
          estEnCoursDeModification={estEnCoursDeModification}
          onButtonClick={onButtonClick}
          aDéjàEtéModifié={candidature !== lauréat}
        />
      </div>
    </div>
  );
};
