import React from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Button, Heading1, Input, Label, PageTemplate, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';
import { ListeDossiersRaccordementReadModel } from '@potentiel/domain';
import routes from '@routes';

type DossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiersRaccordement: ListeDossiersRaccordementReadModel;
};

export const DossiersRaccordement = ({ user, dossiersRaccordement }: DossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Raccordement</Heading1>
          {dossiersRaccordement.références.length > 0 ? (
            <ul>
              {dossiersRaccordement.références.map((dossierRaccordement) => (
                <li>
                  <Tile>{dossierRaccordement}</Tile>
                </li>
              ))}
            </ul>
          ) : (
            <form
              className="flex gap-3 flex-col"
              method="POST"
              action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT}
            >
              {/* Ajouter : date qualification, identifiant gestionnaire réseau (+ aide à la saisie) */}
              <div>
                <Label htmlFor="référence">Référence du dossier de raccordement</Label>
                <Input type="text" id="référence" name="référence" />
              </div>
              <div>
                <Label htmlFor="demandeComplèteRaccordement">
                  Demande complète de raccordement
                </Label>
                <Input
                  type="file"
                  id="demandeComplèteRaccordement"
                  name="demandeComplèteRaccordement"
                />
              </div>
              <Button type="submit">Envoyer</Button>
            </form>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossiersRaccordement);
