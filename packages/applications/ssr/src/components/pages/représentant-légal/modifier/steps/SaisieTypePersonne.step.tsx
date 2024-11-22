'use client';

import { FC, useState } from 'react';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { match } from 'ts-pattern';

import { Heading3 } from '@/components/atoms/headings';
import { ValidationErrors } from '@/utils/formAction';

import { ReprésentantLégal } from '../ModifierReprésentantLégal.form';
import { ModifierReprésentantLégalFormKeys } from '../modifierReprésentantLégal.action';

export type SaisieTypePersonneStepProps = {
  représentantLégalExistant: ReprésentantLégal;
  onChange?: (typePersonne: ReprésentantLégal) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieTypePersonneStep: FC<SaisieTypePersonneStepProps> = ({
  représentantLégalExistant,
  onChange,
  validationErrors,
}) => {
  const [selectedTypePersonne, setSelectedTypePersonne] = useState<
    ReprésentantLégal['typePersonne'] | undefined
  >(représentantLégalExistant.typePersonne);

  const getSituation = match(selectedTypePersonne)
    .with('Personne physique', () => (
      <Situation
        nom="Une personne physique"
        informationÀRemplir="les nom et prénom de la personne"
        pièceJustificativesÀAvoirEnPossession="une copie de titre d'identité (carte d'identité ou passeport) en cours de validité"
      />
    ))
    .with('Personne morale', () => (
      <Situation
        nom="Une personne morale"
        informationÀRemplir="le nom de la société"
        pièceJustificativesÀAvoirEnPossession="un extrait Kbis, pour les sociétés en cours de constitution une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société"
      />
    ))
    .with('Collectivité', () => (
      <Situation
        nom="Une collectivité"
        informationÀRemplir="le nom de la collectivité"
        pièceJustificativesÀAvoirEnPossession="un extrait de délibération portant sur le projet objet de l'offre"
      />
    ))
    .with('Autre', () => (
      <Situation
        nom="Un organisme ou autre"
        informationÀRemplir="le nom de l'organisme"
        pièceJustificativesÀAvoirEnPossession="tout document officiel permettant d'attester de l'existence juridique de la personne"
      />
    ))
    .otherwise(() => null);

  return (
    <div className="flex flex-col gap-4">
      <p>
        Pour effectuer une modification du représentant légal vous devez tout d'abord séléctionner
        le type de personne du nouveau représentant légal pour obtenir les informations nécessaires
        à la correction.
      </p>

      <SelectNext
        label="Choisir le type de personne pour le représentant légal"
        placeholder={`Sélectionner le type de personne pour le représentant légal`}
        state={validationErrors.typeDePersonne ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        nativeSelectProps={{
          name: 'typeDePersonne',
          defaultValue: selectedTypePersonne,
          onChange: ({ currentTarget: { value } }) => {
            delete validationErrors.typeDePersonne;
            setSelectedTypePersonne(value as ReprésentantLégal['typePersonne']);
            onChange &&
              onChange({
                typePersonne: value as ReprésentantLégal['typePersonne'],
                nomReprésentantLégal: représentantLégalExistant.nomReprésentantLégal,
              });
          },
        }}
        options={['Personne physique', 'Personne morale', 'Collectivité', 'Autre'].map((type) => ({
          label: type,
          value: type,
        }))}
      />

      {getSituation}

      <p>Pour démarrer la correction veuillez cliquer sur le bouton "Commencer"</p>
    </div>
  );
};

const Situation: FC<{
  nom: string;
  informationÀRemplir: string;
  pièceJustificativesÀAvoirEnPossession: string;
}> = ({ nom, informationÀRemplir, pièceJustificativesÀAvoirEnPossession }) => (
  <div>
    <Heading3>{nom}</Heading3>
    <div className="mt-4">
      <span className="font-semibold">Information du changement</span> : {informationÀRemplir}
    </div>
    <div>
      <span className="font-semibold">Pièce à avoir en sa possession</span> :{' '}
      {pièceJustificativesÀAvoirEnPossession}
    </div>
  </div>
);
