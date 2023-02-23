import React from 'react';
import { Heading1, PageTemplate } from '@views/components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import { ConsulterGestionnaireRéseauReadModel } from '@modules/gestionnaireRéseau';

type ConsulterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  gestionnaireRéseau: ConsulterGestionnaireRéseauReadModel;
};

export const ConsulterGestionnaireRéseau = ({
  utilisateur,
  gestionnaireRéseau: { nom, format, légende },
}: ConsulterGestionnaireRéseauProps) => (
  <PageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Détail du gestionnaire de réseau</Heading1>
      </div>
      <ul>
        <li>
          Nom : <span className="font-bold">{nom}</span>
        </li>
        <li>
          Format : {format ? <code>{format}</code> : <span className="italic">non renseigné</span>}
        </li>
        <li>
          Légende :{' '}
          {légende ? <code>{légende}</code> : <span className="italic">non renseignée</span>}
        </li>
      </ul>
    </div>
  </PageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
