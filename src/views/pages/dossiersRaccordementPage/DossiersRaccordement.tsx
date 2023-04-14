import React, { useState } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import { Button, Heading1, Input, Label, PageTemplate, Select, Tile } from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel, ListeDossiersRaccordementReadModel } from '@potentiel/domain';
import routes from '@routes';

type DossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiersRaccordement: ListeDossiersRaccordementReadModel; // Ajouter le gestionnaire
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const DossiersRaccordement = ({
  user,
  dossiersRaccordement,
  gestionnairesRéseau,
}: DossiersRaccordementProps) => {
  const gestionnaireActuel = gestionnairesRéseau?.find(
    (gestionnaire) => gestionnaire.codeEIC === gestionnaireRéseauActuel?.codeEIC,
  );

  const [format, setFormat] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement.format || '',
  );
  const [légende, setLégende] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement.légende || '',
  );

  const handleGestionnaireSéléctionné = (sélection: React.FormEvent<HTMLSelectElement>) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === sélection.currentTarget.value,
    );

    gestionnaireSélectionné && gestionnaireSélectionné.aideSaisieRéférenceDossierRaccordement.format
      ? setFormat(gestionnaireSélectionné.aideSaisieRéférenceDossierRaccordement.format)
      : setFormat('');

    gestionnaireSélectionné &&
    gestionnaireSélectionné.aideSaisieRéférenceDossierRaccordement.légende
      ? setLégende(gestionnaireSélectionné.aideSaisieRéférenceDossierRaccordement.légende)
      : setLégende('');
  };

  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Raccordement</Heading1>
        </div>
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
            <div>
              <Label htmlFor="codeEIC" required>
                Gestionnaire réseau
              </Label>
              <Select name="codeEIC" id="codeEIC" defaultValue="none" required>
                <option value="none" disabled hidden>
                  Sélectionnez un gestionnaire
                </option>
                {gestionnairesRéseau.map((gestionnaireRéseau) => {
                  return (
                    <option value={gestionnaireRéseau.codeEIC}>
                      {gestionnaireRéseau.raisonSociale}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div>
              <Label htmlFor="référence" required>
                Référence du dossier de raccordement
              </Label>
              <Input type="text" id="référence" name="référence" required />
            </div>
            <div>
              <Label htmlFor="demandeComplèteRaccordement" required>
                Demande complète de raccordement
              </Label>
              <Input
                type="file"
                id="demandeComplèteRaccordement"
                name="demandeComplèteRaccordement"
                required
              />
            </div>
            <div>
              <Label htmlFor="dateQualification" required>
                Date de qualification
              </Label>
              <Input type="text" id="dateQualification" name="dateQualification" required />
            </div>
            <Button type="submit" className="m-auto">
              Envoyer
            </Button>
          </form>
        )}
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossiersRaccordement);
