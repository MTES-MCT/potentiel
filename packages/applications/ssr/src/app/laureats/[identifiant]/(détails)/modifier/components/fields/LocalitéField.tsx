import { useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { CommunePicker } from '@/components/molecules/CommunePicker';
import { FormRow } from '@/components/atoms/form/FormRow';

import { ModifierLauréatPageProps } from '../../ModifierLauréat.page';
import { FieldValidationErrors } from '../../ModifierLauréat.form';
import { LinkedValuesButton } from '../LinkedValuesButton';

import { ProjectField } from './generic/ProjectField';

type LocalitéFieldProps = {
  candidature: ModifierLauréatPageProps['candidature'];
  lauréat: ModifierLauréatPageProps['lauréat'];
  validationErrors: FieldValidationErrors;
};

export const LocalitéField = ({ candidature, lauréat, validationErrors }: LocalitéFieldProps) => {
  return (
    <div className="flex flex-col w-full mt-0">
      <FormRow>
        <CommuneField
          candidature={candidature}
          lauréat={lauréat}
          validationErrors={validationErrors}
        />
      </FormRow>
      <FormRow>
        <ProjectField
          candidature={candidature.adresse1}
          lauréat={lauréat.adresse1.currentValue}
          estEnCoursDeModification={lauréat.adresse1.estEnCoursDeModification}
          label="Adresse 1"
          name="adresse1"
          validationErrors={validationErrors}
        />
      </FormRow>
      <FormRow>
        <ProjectField
          candidature={candidature.adresse2}
          lauréat={lauréat.adresse2.currentValue}
          estEnCoursDeModification={lauréat.adresse2.estEnCoursDeModification}
          label="Adresse 2"
          name="adresse2"
          validationErrors={validationErrors}
        />
      </FormRow>
    </div>
  );
};

const CommuneField = ({ candidature, lauréat, validationErrors }: LocalitéFieldProps) => {
  const [candidatureCommune, setCandidatureCommune] = useState({
    commune: candidature.commune,
    codePostal: candidature.codePostal,
    departement: candidature.departement,
    region: candidature.region,
  });
  const [lauréatCommune, setLauréatCommune] = useState({
    commune: lauréat.commune.currentValue,
    codePostal: lauréat.codePostal.currentValue,
    departement: lauréat.departement.currentValue,
    region: lauréat.region.currentValue,
  });
  const [linked, setLinked] = useState(
    candidatureCommune.commune === lauréatCommune.commune &&
      candidatureCommune.codePostal === lauréatCommune.codePostal,
  );

  const onButtonClick = () => {
    setLinked((l) => !l);
    setLauréatCommune(candidatureCommune);
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Commune / Code Postal</div>
      <div className="flex-[2] flex flex-row gap-2 px-2">
        <div className="flex-[4]">
          <CommunePicker
            defaultValue={candidatureCommune}
            label=""
            nativeInputProps={{
              required: true,
              'aria-required': true,
            }}
            onSelected={(commune) => {
              if (commune) {
                setCandidatureCommune(commune);
                if (linked) {
                  setLauréatCommune(commune);
                }
              }
            }}
          />
        </div>
        <div className="flex-1">
          <Input
            label=""
            className="w-fit"
            state={validationErrors['candidature.codePostal'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['candidature.codePostal']}
            nativeInputProps={{
              value: candidatureCommune.codePostal,
              onChange: (e) => {
                setCandidatureCommune((c) => ({ ...c, codePostal: e.target.value }));
                if (linked) {
                  setLauréatCommune((c) => ({ ...c, codePostal: e.target.value }));
                }
              },
              required: true,
              'aria-required': true,
              minLength: 5,
              maxLength: 5,
            }}
          />
        </div>
        <input
          type="hidden"
          value={candidatureCommune.codePostal}
          name="candidature.codePostal"
          disabled={candidatureCommune.codePostal === candidature.codePostal}
        />
        <input
          type="hidden"
          value={candidatureCommune.commune}
          name="candidature.commune"
          disabled={candidatureCommune.commune === candidature.commune}
        />
        <input
          type="hidden"
          value={candidatureCommune.departement}
          name="candidature.departement"
          disabled={candidatureCommune.region === candidature.region}
        />
        <input
          type="hidden"
          value={candidatureCommune.region}
          name="candidature.region"
          disabled={candidatureCommune.departement === candidature.departement}
        />
      </div>
      <div className="flex-[2] flex flex-row gap-2 px-2">
        <div className="flex-[2]">
          {linked ? (
            <Input
              label=""
              state={validationErrors['laureat.codePostal'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['laureat.codePostal']}
              nativeInputProps={{
                value: [
                  lauréatCommune.commune,
                  lauréatCommune.departement,
                  lauréatCommune.region,
                ].join(', '),
              }}
              addon={<div />}
              disabled
            />
          ) : (
            <CommunePicker
              defaultValue={lauréatCommune}
              label=""
              nativeInputProps={{
                required: true,
                'aria-required': true,
              }}
              onSelected={(commune) => {
                if (commune) {
                  setLauréatCommune(commune);
                  if (linked) {
                    setCandidatureCommune(commune);
                  }
                }
              }}
            />
          )}
        </div>
        <div className="flex-1">
          <Input
            label=""
            className="w-fit"
            state={validationErrors['laureat.codePostal'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['laureat.codePostal']}
            nativeInputProps={{
              value: lauréatCommune.codePostal,
              onChange: (e) => {
                setLauréatCommune((c) => ({ ...c, codePostal: e.target.value }));
                if (linked) {
                  setCandidatureCommune((c) => ({ ...c, codePostal: e.target.value }));
                }
              },
              required: true,
              'aria-required': true,
              minLength: 5,
              maxLength: 5,
            }}
            disabled={linked}
            addon={
              <LinkedValuesButton
                linked={linked}
                onButtonClick={onButtonClick}
                aDéjàEtéModifié={
                  candidature.commune !== lauréat.commune.currentValue ||
                  candidature.codePostal !== lauréat.codePostal.currentValue
                }
              />
            }
          />
        </div>
        <input
          type="hidden"
          value={lauréatCommune.codePostal}
          name="laureat.codePostal"
          disabled={lauréatCommune.codePostal === lauréat.codePostal.currentValue}
        />
        <input
          type="hidden"
          value={lauréatCommune.commune}
          name="laureat.commune"
          disabled={lauréatCommune.commune === lauréat.commune.currentValue}
        />
        <input
          type="hidden"
          value={lauréatCommune.departement}
          name="laureat.departement"
          disabled={lauréatCommune.region === lauréat.region.currentValue}
        />
        <input
          type="hidden"
          value={lauréatCommune.region}
          name="laureat.region"
          disabled={lauréatCommune.departement === lauréat.departement.currentValue}
        />
      </div>
    </div>
  );
};
