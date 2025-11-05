'use client';

import { FC, ReactNode, useState } from 'react';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { ValidationErrors } from '@/utils/formAction';
import { Heading3 } from '@/components/atoms/headings';

import { ModifierReprésentantLégalFormKeys } from '../../modifier/modifierReprésentantLégal.action';
import { TypeReprésentantLégalSelect } from '../TypeReprésentantLégalSelect';

import { SaisieTypeSociétéStep, TypeSociété } from './SaisieTypeSociété.step';

type Contexte = 'demander' | 'modifier' | 'corriger';

type OnChangeProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export type SaisieTypeStepProps = {
  contexte: Contexte;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  onChange?: ({ typeReprésentantLégal, typeSociété }: OnChangeProps) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

type SaisieTypeState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export const SaisieTypeStep: FC<SaisieTypeStepProps> = ({
  contexte,
  typeReprésentantLégal,
  typeSociété,
  onChange,
  validationErrors,
}) => {
  const [state, setState] = useState<SaisieTypeState>({
    typeReprésentantLégal,
    typeSociété,
  });

  const component = match(state.typeReprésentantLégal)
    .returnType<ReactNode | null>()
    .with('personne-physique', () => (
      <Situation
        contexte={contexte}
        nom="Une personne physique"
        informationÀRemplir="les nom et prénom(s) de la personne"
        piècesJustificatives={
          <li>
            Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité
          </li>
        }
      />
    ))
    .with('personne-morale', () => (
      <>
        <SaisieTypeSociétéStep
          onChange={(typeSociété) => {
            if (onChange) {
              onChange({
                typeReprésentantLégal: state.typeReprésentantLégal,
                typeSociété,
              });
            }
            setState({ ...state, typeSociété });
          }}
        />
        <Situation
          contexte={contexte}
          nom="Une personne morale"
          informationÀRemplir="le nom de la société"
          piècesJustificatives={match(state.typeSociété)
            .with('constituée', () => <li>un extrait Kbis</li>)
            .with('en cours de constitution', () => (
              <ul className="mt-2 ml-4 list-disc">
                <li>une copie des statuts de la société</li>
                <li>
                  une attestation de récépissé de dépôt de fonds pour constitution de capital social
                </li>
                <li>une copie de l’acte désignant le représentant légal de la société</li>
              </ul>
            ))
            .with('non renseignée', () => (
              <li className="italic">
                Veuillez sélectionner le type de société pour voir les pièces justificatives à
                fournir
              </li>
            ))
            .exhaustive()}
        />
      </>
    ))
    .with('collectivité', () => (
      <Situation
        contexte={contexte}
        nom="Une collectivité"
        informationÀRemplir="le nom de la collectivité"
        piècesJustificatives={<li>Un extrait de délibération portant sur le projet</li>}
      />
    ))
    .with('autre', () => (
      <Situation
        contexte={contexte}
        nom="Un organisme ou autre"
        informationÀRemplir="le nom de l'organisme"
        piècesJustificatives={
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
        typeReprésentantLégalActuel={state.typeReprésentantLégal}
        onTypeReprésentantLégalSelected={(typeReprésentantLégal) => {
          delete validationErrors.typeRepresentantLegal;
          if (onChange) {
            onChange({ typeReprésentantLégal, typeSociété: state.typeSociété });
          }
          setState((state) => ({ ...state, typeReprésentantLégal }));
        }}
      />

      {state.typeSociété === 'non renseignée' && (
        <input type={'hidden'} value={'non renseignée'} name="typeSociete" />
      )}

      {component}
    </>
  );
};

const Situation: FC<{
  nom: string;
  contexte: Contexte;
  informationÀRemplir: string;
  piècesJustificatives: ReactNode;
}> = ({ contexte, nom, informationÀRemplir, piècesJustificatives }) => {
  const wordingPiècesJustificatives = match(contexte)
    .with(P.union('demander', 'corriger'), () => `Pièces à joindre :`)
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
          <ul className="mt-2 ml-4 list-disc">{piècesJustificatives}</ul>
        </div>
      </div>
    </div>
  );
};
