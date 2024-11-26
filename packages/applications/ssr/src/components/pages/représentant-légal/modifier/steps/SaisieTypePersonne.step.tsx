'use client';

import { FC, ReactNode, useState } from 'react';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Heading3 } from '@/components/atoms/headings';
import { ValidationErrors } from '@/utils/formAction';

import { ModifierReprésentantLégalFormKeys } from '../modifierReprésentantLégal.action';
import { TypeReprésentantLégalSelect } from '../../TypeReprésentantLégalSelect';

export type SaisieTypePersonneStepProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange?: (nouveauType: ReprésentantLégal.TypeReprésentantLégal.RawType) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieTypePersonneStep: FC<SaisieTypePersonneStepProps> = ({
  typeReprésentantLégal,
  onChange,
  validationErrors,
}) => {
  const [selectedTypePersonne, setSelectedTypePersonne] = useState(typeReprésentantLégal);

  const getSituation = match(selectedTypePersonne)
    .with('personne-physique', () => (
      <Situation
        nom="Une personne physique"
        informationÀRemplir="les noms et prénoms de la personne"
        pièceJustificativesÀAvoirEnPossession={
          <ul>
            <li>
              une copie de titre d'identité (carte d'identité ou passeport) en cours de validité
            </li>
          </ul>
        }
      />
    ))
    .with('personne-morale', () => (
      <Situation
        nom="Une personne morale"
        informationÀRemplir="le nom de la société"
        pièceJustificativesÀAvoirEnPossession={
          <ul>
            <li>un extrait Kbis</li>
            <li>pour les sociétés en cours de constitution: une copie des statuts de la société</li>
            <li>
              une attestation de récépissé de dépôt de fonds pour constitution de capital social
            </li>
            <li>une copie de l’acte désignant le représentant légal de la société</li>
          </ul>
        }
      />
    ))
    .with('collectivité', () => (
      <Situation
        nom="Une collectivité"
        informationÀRemplir="le nom de la collectivité"
        pièceJustificativesÀAvoirEnPossession={
          <ul>
            <li>un extrait de délibération portant sur le projet objet de l'offre</li>
          </ul>
        }
      />
    ))
    .with('autre', () => (
      <Situation
        nom="Un organisme ou autre"
        informationÀRemplir="le nom de l'organisme"
        pièceJustificativesÀAvoirEnPossession={
          <ul>
            <li>
              tout document officiel permettant d'attester de l'existence juridique de la personne
            </li>
          </ul>
        }
      />
    ))
    .otherwise(() => null);

  return (
    <div className="flex flex-col gap-4">
      <p>
        Pour effectuer une modification du représentant légal vous devez tout d'abord sélectionner
        le type de personne du nouveau représentant légal pour connaître les documents obligatoire
        pour la modification à la correction.
      </p>
      <TypeReprésentantLégalSelect
        id="typeReprésentantLégal"
        name="typeRepresentantLegal"
        label="Choisir le type de représentant légal"
        state={validationErrors.typeRepresentantLegal ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        typeReprésentantLégalActuel={selectedTypePersonne}
        onTypeReprésentantLégalSelected={(type) => {
          delete validationErrors.typeRepresentantLegal;
          setSelectedTypePersonne(type);
          onChange && onChange(type);
        }}
      />
      {getSituation}
    </div>
  );
};

const Situation: FC<{
  nom: string;
  informationÀRemplir: string;
  pièceJustificativesÀAvoirEnPossession: ReactNode;
}> = ({ nom, informationÀRemplir, pièceJustificativesÀAvoirEnPossession }) => (
  <div>
    <Heading3>{nom}</Heading3>
    <div className="mt-4">
      <span className="font-semibold">Information du changement</span> : {informationÀRemplir}
    </div>
    <div>
      <span className="font-semibold">Pièces à avoir en sa possession</span> :{' '}
      {pièceJustificativesÀAvoirEnPossession}
    </div>
  </div>
);
