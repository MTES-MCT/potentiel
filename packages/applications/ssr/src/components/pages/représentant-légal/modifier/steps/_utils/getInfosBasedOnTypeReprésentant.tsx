import { match } from 'ts-pattern';
import { FC, ReactNode } from 'react';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Heading3 } from '@/components/atoms/headings';

type GetInfosBasedOnTypeReprésentant = (
  typeReprésentant: ReprésentantLégal.TypeReprésentantLégal.RawType,
) => {
  nom: string;
  input: { label: string; hintText: string };
  component: ReactNode | null;
};
export const getInfosBasedOnTypeReprésentant: GetInfosBasedOnTypeReprésentant = (
  typeReprésentant,
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
          nom="Une personne physique"
          informationÀRemplir="les nom et prénom(s) de la personne"
          pièceJustificativesÀAvoirEnPossession={
            <li>
              une copie de titre d'identité (carte d'identité ou passeport) en cours de validité
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
          nom="Une personne morale"
          informationÀRemplir="le nom de la société"
          pièceJustificativesÀAvoirEnPossession={
            <>
              <li>un extrait Kbis</li>
              <li>
                pour les sociétés en cours de constitution: une copie des statuts de la société
              </li>
              <li>
                une attestation de récépissé de dépôt de fonds pour constitution de capital social
              </li>
              <li>une copie de l’acte désignant le représentant légal de la société</li>
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
          nom="Une collectivité"
          informationÀRemplir="le nom de la collectivité"
          pièceJustificativesÀAvoirEnPossession={
            <li>un extrait de délibération portant sur le projet objet de l'offre</li>
          }
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
          nom="Un organisme ou autre"
          informationÀRemplir="le nom de l'organisme"
          pièceJustificativesÀAvoirEnPossession={
            <>
              <li>
                tout document officiel permettant d'attester de l'existence juridique de la personne
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
  informationÀRemplir: string;
  pièceJustificativesÀAvoirEnPossession: ReactNode;
}> = ({ nom, informationÀRemplir, pièceJustificativesÀAvoirEnPossession }) => (
  <div>
    <Heading3>{nom}</Heading3>
    <div className="mt-4 flex flex-col gap-2">
      <div>
        <span className="font-semibold">Information du changement :</span> {informationÀRemplir}
      </div>
      <div>
        <span className="font-semibold">Pièces à fournir :</span>
        <ul className="mt-2 ml-4 list-disc">{pièceJustificativesÀAvoirEnPossession}</ul>
      </div>
    </div>
  </div>
);
