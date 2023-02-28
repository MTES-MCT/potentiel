import React from 'react';
import { Heading1, LinkButton, PageTemplate } from '@views/components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import { ConsulterGestionnaireRéseauReadModel } from '@modules/gestionnaireRéseau';
import routes from '@routes';

type ConsulterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  gestionnaireRéseau: ConsulterGestionnaireRéseauReadModel;
};

export const ConsulterGestionnaireRéseau = ({
  utilisateur,
  gestionnaireRéseau: { raisonSociale, format, légende, codeEIC },
}: ConsulterGestionnaireRéseauProps) => (
  <PageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Détail du gestionnaire de réseau</Heading1>
      </div>
      <ul>
        <li>
          Raison sociale : <span className="font-bold">{raisonSociale}</span>
        </li>
        <li>code EIC : {codeEIC}</li>
        <li>
          Format : {format ? <code>{format}</code> : <span className="italic">non renseigné</span>}
        </li>
        <li>Légende : {légende ? légende : <span className="italic">non renseignée</span>}</li>
      </ul>
      <LinkButton href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</LinkButton>
    </div>
  </PageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
