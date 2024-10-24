'use client';

import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Accordion from '@codegouvfr/react-dsfr/Accordion';

export const DescriptionDémarcheChangementReprésentantLégal: FC = () => (
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

    <div>
      <Situation
        nom="Une personne physique"
        informationÀRemplir="les nom et prénom de la personne"
        pièceJustificativesÀJoindre="une copie de titre d'identité (carte d'identité ou passeport) en cours de validité"
      />
      <Situation
        nom="Une personne morale"
        informationÀRemplir="le nom de la société"
        pièceJustificativesÀJoindre="un extrait Kbis, pour les sociétés en cours de constitution une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société"
      />
      <Situation
        nom="Une collectivité"
        informationÀRemplir="le nom de la collectivité"
        pièceJustificativesÀJoindre="un extrait de délibération portant sur le projet objet de l'offre"
      />
      <Situation
        nom="Un organisme ou autre"
        informationÀRemplir="le nom de l'organisme"
        pièceJustificativesÀJoindre="tout document officiel permettant d'attester de l'existence juridique de la personne"
      />
    </div>

    <Alert
      severity="info"
      title="Concernant la sécurité de vos données"
      description=<ul className="p-4 list-disc">
        <li>
          Un filigrane sera automatiquement appliqué sur l'ensemble des pièces justificatives
          transmises
        </li>
        <li>Les pièces seront automatiquement supprimées après traitement de votre demande</li>
      </ul>
    />

    <p>
      Ensuite votre demande sera instruite par le service de l'état en région de votre projet. À
      défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux règles du
      cahier des charges en vigueur sur votre projet.
    </p>
    <p>Pour démarrer la démarche veuillez cliquer sur le bouton "Commencer"</p>
  </div>
);

const Situation: FC<{
  nom: string;
  informationÀRemplir: string;
  pièceJustificativesÀJoindre: string;
}> = ({ nom, informationÀRemplir, pièceJustificativesÀJoindre }) => (
  <Accordion defaultExpanded label={nom}>
    <ul className="ml-2 list-disc text-sm">
      <li>Information du changement : {informationÀRemplir}</li>
      <li>Pièce justificative : {pièceJustificativesÀJoindre}</li>
    </ul>
  </Accordion>
);
