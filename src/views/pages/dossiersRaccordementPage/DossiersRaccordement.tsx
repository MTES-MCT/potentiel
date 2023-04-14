import React, { FC, useState } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Button,
  ExternalLink,
  Heading1,
  InfoBox,
  Input,
  Label,
  PageTemplate,
  Select,
  Tile,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { GestionnaireRéseauReadModel, ListeDossiersRaccordementReadModel } from '@potentiel/domain';
import routes from '@routes';

type DossiersRaccordementProps = {
  user: UtilisateurReadModel;
  dossiersRaccordement: ListeDossiersRaccordementReadModel;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const DossiersRaccordement = ({
  user,
  dossiersRaccordement,
  gestionnairesRéseau,
}: DossiersRaccordementProps) => {
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Raccordement</Heading1>
        </div>

        {dossiersRaccordement.références.length > 0 ? (
          <ListeDossiersRaccordements dossiersRaccordement={dossiersRaccordement} />
        ) : (
          <DemandeComplèteRaccordementForm gestionnairesRéseau={gestionnairesRéseau} />
        )}
      </div>
    </PageTemplate>
  );
};
hydrateOnClient(DossiersRaccordement);

const ListeDossiersRaccordements: FC<{
  dossiersRaccordement: { références: Array<string> };
}> = ({ dossiersRaccordement }) => {
  return (
    <ul>
      {dossiersRaccordement.références.map((dossierRaccordement) => (
        <li>
          <Tile>{dossierRaccordement}</Tile>
        </li>
      ))}
    </ul>
  );
};

const DemandeComplèteRaccordementForm: FC<{
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
}> = ({ gestionnairesRéseau }) => {
  const [format, setFormat] = useState('');
  const [légende, setLégende] = useState('');

  const handleGestionnaireSéléctionné = (codeEIC: string) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === codeEIC,
    );
    setFormat(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.format || '');
    setLégende(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.légende || '');
  };

  return (
    <form
      className="flex gap-3 flex-col"
      method="POST"
      action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT}
    >
      <p className="text-sm italic">Tous les champs sont obligatoires</p>
      <div className="flex flex-col gap-4">
        {gestionnairesRéseau && gestionnairesRéseau.length > 0 && (
          <div>
            <Label htmlFor="codeEICGestionnaireRéseau">Gestionnaire de réseau</Label>
            <Select
              id="codeEICGestionnaireRéseau"
              name="codeEICGestionnaireRéseau"
              onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
              defaultValue="none"
            >
              <option value="none" disabled hidden>
                Sélectionnez votre gestionnaire de réseau
              </option>
              {gestionnairesRéseau.map(({ codeEIC, raisonSociale }) => (
                <option value={codeEIC} key={codeEIC}>
                  {raisonSociale} (code EIC : {codeEIC})
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="référenceDossierRaccordement">
            Référence du dossier de raccordement du projet *
          </Label>
          {(format || légende) && (
            <InfoBox className="mt-2 mb-3">
              {légende && <p className="m-0">Format attendu : {légende}</p>}
              {format && <p className="m-0 italic">Exemple : {format}</p>}
            </InfoBox>
          )}
          <Input
            type="text"
            id="référenceDossierRaccordement"
            name="référenceDossierRaccordement"
            placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
            required
          />
          <p className="mt-4 mb-0 italic">
            * Où trouver la référence du dossier de raccordement ?
            <br />
            Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre
            demande complète de raccordement (
            <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
              Voir un exemple
            </ExternalLink>
            )
          </p>
        </div>
      </div>
      <div>
        <Label htmlFor="accuséRéception">
          Accusé de réception de la demande complète de raccordement
        </Label>
        <Input type="file" id="accuséRéception" name="accuséRéception" required />
      </div>
      <div>
        <Label htmlFor="dateQualification">Date de qualification</Label>
        <Input type="date" id="dateQualification" name="dateQualification" required />
      </div>
      <Button type="submit" className="m-auto">
        Envoyer
      </Button>
    </form>
  );
};
