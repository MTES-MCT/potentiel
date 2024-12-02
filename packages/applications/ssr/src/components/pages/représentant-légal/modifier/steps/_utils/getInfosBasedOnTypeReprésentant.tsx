import { match } from 'ts-pattern';
import { FC, ReactNode } from 'react';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Heading3 } from '@/components/atoms/headings';

type Contexte = 'demander' | 'modifier';

type GetInfosBasedOnTypeReprésentant = (
  typeReprésentant: ReprésentantLégal.TypeReprésentantLégal.RawType,
  contexte: Contexte,
) => {
  nom: string;
  input: { label: string; hintText: string };
  component: ReactNode | null;
};
export const getInfosBasedOnTypeReprésentant: GetInfosBasedOnTypeReprésentant = (
  typeReprésentant,
  contexte,
) =>
  match(typeReprésentant)
    .returnType<{
      nom: string;
      input: { label: string; hintText: string };
      component: ReactNode | null;
    }>()
    .with('personne-physique', () => ({
      nom: 'Personne physique',
      input: {
        label: 'Les nom et prénom(s) de la personne physique',
        hintText: 'les nom et prénoms',
      },
      component: (
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
      ),
    }))
    .with('personne-morale', () => ({
      nom: 'Personne morale',
      input: {
        label: 'Le nom de la société',
        hintText: 'le nom de la société',
      },
      component: (
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
                    une attestation de récépissé de dépôt de fonds pour constitution de capital
                    social
                  </li>
                  <li>une copie de l’acte désignant le représentant légal de la société</li>
                </ul>
              </li>
            </>
          }
        />
      ),
    }))
    .with('collectivité', () => ({
      nom: 'Collectivité',
      input: {
        label: 'Le nom de la collectivité',
        hintText: 'le nom de la collectivité',
      },
      component: (
        <Situation
          contexte={contexte}
          nom="Une collectivité"
          informationÀRemplir="le nom de la collectivité"
          piècesJustificative={<li>Un extrait de délibération portant sur le projet</li>}
        />
      ),
    }))
    .with('autre', () => ({
      nom: `Organisme ou autre`,
      input: {
        label: `Le nom de l'organisme`,
        hintText: `le nom de l'organisme`,
      },
      component: (
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
      ),
    }))
    .with('inconnu', () => ({
      nom: 'Inconnu',
      input: {
        label: 'Le nom',
        hintText: 'le nom',
      },
      component: null,
    }))
    .exhaustive();

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
