import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { CommunePicker } from '@/components/molecules/CommunePicker';
import { FormRow } from '@/components/atoms/form/FormRow';

import { ModifierLauréatPageProps } from '../ModifierLauréat.page';

import { ProjectField } from './ModifierLauréatFields';

type LocalitéField = {
  candidature: ModifierLauréatPageProps['candidature'];
  lauréat: ModifierLauréatPageProps['lauréat'];
};

export const LocalitéField = ({ candidature, lauréat }: LocalitéField) => {
  return (
    <div className="flex flex-col w-full mt-0">
      <FormRow>
        <ProjectField
          candidature={candidature.adresse1}
          lauréat={lauréat.adresse1.currentValue}
          estEnCoursDeModification={lauréat.adresse1.estEnCoursDeModification}
          label="Adresse 1"
          name="adresse1"
        />
      </FormRow>
      <FormRow>
        <ProjectField
          candidature={candidature.adresse2}
          lauréat={lauréat.adresse2.currentValue}
          estEnCoursDeModification={lauréat.adresse2.estEnCoursDeModification}
          label="Adresse 2"
          name="adresse2"
        />
      </FormRow>
      <FormRow>
        <CommuneField candidature={candidature} lauréat={lauréat} />
      </FormRow>
      <FormRow>
        <ProjectField
          candidature={candidature.codePostal}
          lauréat={lauréat.codePostal.currentValue}
          estEnCoursDeModification={lauréat.codePostal.estEnCoursDeModification}
          label="Code Postal"
          name="codePostal"
          nativeInputProps={{
            minLength: 5,
            maxLength: 5,
          }}
        />
      </FormRow>
    </div>
  );
};

const CommuneField = ({ candidature, lauréat }: LocalitéField) => {
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
  const [linked, setLinked] = useState(candidatureCommune === lauréatCommune);
  const onButtonClick = () => {
    setLinked((l) => !l);
    setLauréatCommune(candidatureCommune);
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Commune</div>
      <div className="flex-1 flex ">
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
        <input type="hidden" value={candidatureCommune.commune} name="candidature.commune" />
        {/* {validationErrors['commune']} */}
        <input
          type="hidden"
          value={candidatureCommune.departement}
          name="candidature.departement"
        />
        {/* {validationErrors['departement']} */}
        <input type="hidden" value={candidatureCommune.region} name="candidature.region" />
        {/* {validationErrors['region']} */}
      </div>
      <div className="flex-1 flex flex-row gap-2 items-center">
        <div className="flex-1 flex ">
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
            addon={
              <Button
                type="button"
                iconId={linked ? 'fr-icon-lock-unlock-fill' : 'fr-icon-lock-fill'}
                title="Appliquer les changements au projet"
                onClick={onButtonClick}
                nativeButtonProps={{ 'aria-label': 'Appliquer les changements au projet' }}
              />
            }
          />
          <input
            type="hidden"
            value={lauréatCommune.commune}
            disabled={lauréatCommune.commune === lauréat.commune.currentValue}
            name="laureat.commune"
          />
          {/* {validationErrors['commune']} */}
          <input
            type="hidden"
            value={lauréatCommune.departement}
            disabled={lauréatCommune.departement === lauréat.departement.currentValue}
            name="laureat.departement"
          />
          {/* {validationErrors['departement']} */}
          <input
            type="hidden"
            value={lauréatCommune.region}
            disabled={lauréatCommune.region === lauréat.region.currentValue}
            name="laureat.region"
          />
          {/* {validationErrors['region']} */}
        </div>
      </div>
    </div>
  );
};
