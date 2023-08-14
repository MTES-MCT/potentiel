import type { Request } from 'express';
import React from 'react';
import {
  Link,
  LegacyPageTemplate,
  ExternalLink,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from '@components';
import { hydrateOnClient } from '../helpers';

type DéclarationAccessibilitéProps = {
  request: Request;
};

export const DéclarationAccessibilité = ({ request }: DéclarationAccessibilitéProps) => {
  return (
    <LegacyPageTemplate user={request.user}>
      <>
        <Heading1>Déclaration d’accessibilité</Heading1>
        <p>Établie le 15 décembre 2022.</p>
        <p>
          Le ministère de la Transition Énergétique s’engage à rendre son service accessible,
          conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.
        </p>
        <p>
          Cette déclaration d’accessibilité s’applique à{' '}
          <Link href="https://potentiel.beta.gouv.fr/">Potentiel</Link>.
        </p>
        <Heading2>État de conformité</Heading2>
        <p>
          Potentiel est non conforme avec le{' '}
          <abbr title="Référentiel général de l'amélioration de l'accessibilité">RGAA</abbr>. Le
          site n’a encore pas été audité.
        </p>
        <Heading3>Détail</Heading3>
        <p>
          Un audit interne a été réalisé en mars 2023 afin de :
          <ul>
            <li>détecter les défauts d'accessibilité les plus évidents</li>
            <li>se préparer à un audit de conformité</li>
          </ul>
        </p>
        Après correctifs apportés, voici l'état de la plateforme Potentiel en août 2023 :
        <Heading4>Conforme</Heading4>
        <ul>
          <li>Page d'accueil accessible depuis toutes les pages</li>
          <li>Déclaration d'accessibilité existante et accessible depuis toutes les pages</li>
          <li>La langue du document est pertinente</li>
          <li>Aucune information n'est véhiculée uniquement par la couleur</li>
          <li>L'utilisateur est averti lors de l'ouverture d'une nouvelle fenêtre</li>
          <li>Site responsive</li>
          <li>Site lisible lorsque la taille de la police est portée à 200%</li>
          <li>Site compréhensible sans style</li>
          <li>Chaque champ de formulaire a une étiquette (label)</li>
          <li>La hiérarchie des titres est cohérente</li>
          <li>Site utilisable au clavier</li>
          <li>Chaque page contient un menu d'accès rapides</li>
          <li>Les éléments sont suffisement contrastés</li>
          <li>Les actions sont spécifiques - les liens ont un intitulé précis</li>
          <li>Les zones principales d'une page sont définies (header, main, footer)</li>
          <li>Les images ont une alternative textuelle</li>
        </ul>
        <Heading4>Non-conforme</Heading4>
        <ul>
          <li>
            Il devrait exister deux moyens de naviguer dans le site. Actuellement le seul moyen
            proposé est le menu de navigation. Une seconde option est à ajouter entre un champ de
            recherche, un plan de site ou un fil d'ariane.
          </li>
          <li>
            Les fichiers en téléchargement ne sont pas accessibles. Il faudrait notamment indiquer
            le poids et la taille des documents.
          </li>
        </ul>
        <Heading4>Non-applicable</Heading4>
        <ul>
          <li>Les CAPTCHA ont une alternative</li>
          <li>Les mouvements automatiques peuvent être arrêtés</li>
          <li>Les vidéos ont une alternative</li>
        </ul>
        <Heading2>Amélioration et contact</Heading2>
        <p>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
          responsable de Potentiel pour être orienté vers une alternative accessible ou obtenir le
          contenu sous une autre forme.
          <ul>
            <li>E-mail : contact@potentiel.beta.gouv.fr</li>
            <li>Adresse : Tour Séquoïa 1, place Carpeaux 92055 La Défense Cedex</li>
          </ul>
        </p>
        <Heading2>Voie de recours</Heading2>
        <p>
          Cette procédure est à utiliser dans le cas suivant : vous avez signalé au responsable du
          site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un
          des services du portail et vous n’avez pas obtenu de réponse satisfaisante.
          <br /> Vous pouvez :
          <ul>
            <li>
              Écrire un message au{' '}
              <ExternalLink href="https://formulaire.defenseurdesdroits.fr/code/afficher.php?ETAPE=accueil_2016">
                Défenseur des droits
              </ExternalLink>
            </li>
            <li>
              Contacter le{' '}
              <ExternalLink href="https://www.defenseurdesdroits.fr/saisir/delegues">
                délégué du Défenseur des droits dans votre région
              </ExternalLink>
            </li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) :
              <br />
              Défenseur des droits
              <br />
              Libre réponse 71120 75342 Paris CEDEX 07
            </li>
          </ul>
        </p>
      </>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DéclarationAccessibilité);
