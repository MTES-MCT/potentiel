'use client';

import { FC, ReactNode, useState } from 'react';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';
import { Heading3 } from '@/components/atoms/headings';

import { ModifierReprésentantLégalFormKeys } from '../../modifier/modifierReprésentantLégal.action';
import { TypeReprésentantLégalSelect } from '../../TypeReprésentantLégalSelect';

type Contexte = 'demander' | 'modifier';

export type SaisieTypeStepProps = {
  contexte: 'demander' | 'modifier';
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange?: (nouveauType: ReprésentantLégal.TypeReprésentantLégal.RawType) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieTypeStep: FC<SaisieTypeStepProps> = ({
  contexte,
  typeReprésentantLégal,
  onChange,
  validationErrors,
}) => {
  const [selectedTypePersonne, setSelectedTypePersonne] = useState(typeReprésentantLégal);

  const component = match(selectedTypePersonne)
    .returnType<ReactNode | null>()
    .with('personne-physique', () => (
      <Situation
        contexte={contexte}
        nom="Une personne physique"
        informationÀRemplir="les nom et prénom(s) de la personne"
        piècesJustificative={
          <li>
            Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité
          </li>
        }
      />
    ))
    .with('personne-morale', () => (
      <Situation
        contexte={contexte}
        nom="Une personne morale"
        informationÀRemplir="le nom de la société"
        piècesJustificative={
          <>
            <li>
              Pour les sociétés constituées :
              <ul className="mt-2 ml-4 list-disc">
                <li>un extrait Kbis</li>
              </ul>
            </li>
            <li>
              Pour les sociétés en cours de constitution :
              <ul className="mt-2 ml-4 list-disc">
                <li>une copie des statuts de la société</li>
                <li>
                  une attestation de récépissé de dépôt de fonds pour constitution de capital social
                </li>
                <li>une copie de l’acte désignant le représentant légal de la société</li>
              </ul>
            </li>
          </>
        }
      />
    ))
    .with('collectivité', () => (
      <Situation
        contexte={contexte}
        nom="Une collectivité"
        informationÀRemplir="le nom de la collectivité"
        piècesJustificative={<li>Un extrait de délibération portant sur le projet</li>}
      />
    ))
    .with('autre', () => (
      <Situation
        contexte={contexte}
        nom="Un organisme ou autre"
        informationÀRemplir="le nom de l'organisme"
        piècesJustificative={
          <>
            <li>
              Tout document officiel permettant d'attester de l'existence juridique de l'organisme
            </li>
          </>
        }
      />
    ))
    .with('inconnu', () => null)
    .exhaustive();

  return (
    <>
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
      {component}
    </>
  );
};

const Situation: FC<{
  nom: string;
  contexte: Contexte;
  informationÀRemplir: string;
  piècesJustificative: ReactNode;
}> = ({ contexte, nom, informationÀRemplir, piècesJustificative }) => {
  const wordingPiècesJustificatives = match(contexte)
    .with('demander', () => `Pièces à joindre :`)
    .with(
      'modifier',
      () =>
        `Pièces à avoir en votre possession (vous n'aurez pas à les téléverser sur Potentiel) :`,
    )
    .exhaustive();

  return (
    <div>
      <Heading3>{nom}</Heading3>
      <div className="mt-4 flex flex-col gap-2">
        <div>
          <span className="font-semibold">Information du changement :</span> {informationÀRemplir}
        </div>
        <div>
          <span className="font-semibold">{wordingPiècesJustificatives}</span>
          <ul className="mt-2 ml-4 list-disc">{piècesJustificative}</ul>
        </div>
      </div>
    </div>
  );
};
