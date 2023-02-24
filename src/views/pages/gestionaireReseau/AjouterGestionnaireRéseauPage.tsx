import React from 'react';
import {
  Button,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  PageTemplate,
} from '@views/components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import routes from '@routes';

type AjouterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
};

export const AjouterGestionnaireRéseau = ({ utilisateur }: AjouterGestionnaireRéseauProps) => (
  <PageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Ajouter un gestionnaire de réseau</Heading1>
      </div>
      <FormulaireChampsObligatoireLégende />
      <form method="post" action={routes.POST_AJOUTER_GESTIONNAIRE_RESEAU}>
        <div className="flex gap-3 flex-col">
          <div>
            <label htmlFor="raisonSociale">Raison sociale</label>
            <Input type="text" id="raisonSociale" name="raisonSociale" required />
          </div>
          <div>
            <label htmlFor="codeEIC">Code EIC</label>
            <Input type="text" id="codeEIC" name="codeEIC" required />
          </div>
          <div>
            <label htmlFor="format">Format</label>
            <Input type="text" id="format" name="format" />
          </div>
          <div>
            <label htmlFor="légende">Légende</label>
            <Input type="text" id="légende" name="légende" />
          </div>
        </div>
        <Button type="submit" className="mt-4">
          Ajouter
        </Button>
      </form>
    </div>
  </PageTemplate>
);

hydrateOnClient(AjouterGestionnaireRéseau);
