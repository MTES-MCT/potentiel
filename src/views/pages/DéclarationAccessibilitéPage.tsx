import type { Request } from 'express';
import React from 'react';
import { Link, LegacyPageTemplate, ExternalLink, Heading1, Heading2 } from '@components';
import { hydrateOnClient } from '../helpers';

type DéclarationAccessibilitéProps = {
  request: Request;
};

export const DéclarationAccessibilité = ({ request }: DéclarationAccessibilitéProps) => {
  return (
    <LegacyPageTemplate user={request.user}>
      <main role="main">
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
      </main>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DéclarationAccessibilité);
