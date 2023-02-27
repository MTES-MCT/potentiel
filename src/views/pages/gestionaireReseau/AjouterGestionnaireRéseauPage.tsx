import React from 'react';
import {
  Button,
  ErrorBox,
  FormulaireChampsObligatoireLégende,
  Heading1,
  Input,
  Label,
  Link,
  PageTemplate,
} from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { hydrateOnClient } from '@views/helpers';
import routes from '@routes';

type AjouterGestionnaireRéseauProps = {
  utilisateur: UtilisateurReadModel;
  erreur?: string;
  erreurValidation?: Record<string, string>;
};

export const AjouterGestionnaireRéseau = ({
  utilisateur,
  erreur,
  erreurValidation,
}: AjouterGestionnaireRéseauProps) => (
  <PageTemplate user={utilisateur} currentPage={'liste-gestionnaires-réseau'}>
    <div className="panel">
      <div className="panel__header">
        <Heading1>Ajouter un gestionnaire de réseau</Heading1>
      </div>
      {erreur && <ErrorBox title={erreur} />}
      <form method="post" action={routes.POST_AJOUTER_GESTIONNAIRE_RESEAU}>
        <div className="flex gap-3 flex-col">
          <FormulaireChampsObligatoireLégende className="self-end" />
          <div>
            <Label htmlFor="raisonSociale" required>
              Raison sociale
            </Label>
            <Input
              type="text"
              error={erreurValidation ? erreurValidation['error-body.raisonSociale'] : undefined}
              id="raisonSociale"
              name="raisonSociale"
            />
          </div>
          <div>
            <Label htmlFor="codeEIC" required>
              Code EIC
            </Label>
            <Input
              type="text"
              error={erreurValidation ? erreurValidation['error-body.codeEIC'] : undefined}
              id="codeEIC"
              name="codeEIC"
            />
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <Input type="text" id="format" name="format" />
          </div>
          <div>
            <Label htmlFor="légende">Légende</Label>
            <Input type="text" id="légende" name="légende" />
          </div>
        </div>
        <Button type="submit" className="mt-4 mr-3">
          Ajouter
        </Button>
        <Link href={routes.GET_LISTE_GESTIONNAIRES_RESEAU}>Retourner à la liste</Link>
      </form>
    </div>
  </PageTemplate>
);

hydrateOnClient(AjouterGestionnaireRéseau);
