import React from 'react';
import { Button, Heading1, Input, Label, Link, PageTemplate } from '@components';
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
        <Heading1>Gestionnaire de réseau ({codeEIC})</Heading1>
      </div>
      <form method="post" action={routes.POST_MODIFIER_GESTIONNAIRE_RESEAU(codeEIC)}>
        <div className="flex gap-3 flex-col">
          <div>
            <Label htmlFor="raisonSociale">Raison sociale</Label>
            <Input
              type="text"
              // error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
              id="raisonSociale"
              name="raisonSociale"
              defaultValue={raisonSociale || ''}
            />
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Input type="text" id="format" name="format" defaultValue={format || ''} />
          </div>
          <div>
            <Label htmlFor="légende">Légende</Label>
            <Input type="text" id="légende" name="légende" defaultValue={légende || ''} />
          </div>
        </div>
        <Button type="submit" className="mt-4 mr-3">
          Enregistrer
        </Button>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </form>
    </div>
  </PageTemplate>
);

hydrateOnClient(ConsulterGestionnaireRéseau);
