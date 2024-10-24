'use client';

import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Tile } from '@/components/organisms/Tile';

export const Description: FC<{}> = () => (
  <div className="flex flex-col gap-4">
    <p>
      Conformément au cahier des charges en vigueur sur votre projet et afin de faciliter
      l'instruction de vos démarches sur la plateforme Potentiel, il vous est possible d'apporter
      des modifications concernant le représentant légal de votre projet.
    </p>

    <p>
      Pour ce faire vous allez devoir remplir une demande en ligne avec des éléments selon la
      situation du nouveau représentant légal du projet.
    </p>
    <div className="flex flex-col md:flex-row gap-3">
      <Tile className="flex flex-col gap-4">
        <p>Une personne physique</p>

        <ul className="text-sm">
          <li>Les nom et prénom de la personne</li>
          <li>
            Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité
          </li>
        </ul>
      </Tile>
      <Tile className="flex flex-col gap-4">
        <p>Une personne morale</p>

        <ul className="text-sm">
          <li>Le nom de la société</li>
          <li>
            Un extrait Kbis, pour les sociétés en cours de constitutionv une copie des statuts de la
            société en cours de constitution, une attestation de récépissé de dépôt de fonds pour
            constitution de capital social et une copie de l’acte désignant le représentant légal de
            la société
          </li>
        </ul>
      </Tile>
      <Tile className="flex flex-col gap-4">
        <p>Une collectivité</p>

        <ul className="text-sm">
          <li>Le nom de la collectivité</li>
          <li>Un extrait de délibération portant sur le projet objet de l'offre</li>
        </ul>
      </Tile>
      <Tile className="flex flex-col gap-4">
        <p>Un organisme ou autre</p>

        <ul className="text-sm">
          <li>Le nom de l'organisme</li>
          <li>
            Tout document officiel permettant d'attester de l'existence juridique de la personne
          </li>
        </ul>
      </Tile>
    </div>

    <Alert
      severity="info"
      title="Concernant la sécurité de vos données"
      description=<ul className="p-4 list-disc">
        <li>
          Un filigrane sera automatiquement appliqué sur l'ensemble des pièces justificatives
          transmise
        </li>
        <li>Les pièces seront automatiquement supprimées après traitement de votre demande</li>
      </ul>
    />

    <p>
      Ensuite votre demande sera instruite par la direction départementale de la région de votre
      projet. À défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux
      règles du cahier des charges en vigueur sur votre projet.
    </p>
    <p>Pour démarrer la démarche veuillez cliquer sur le bouton "Commencer"</p>
  </div>
);
