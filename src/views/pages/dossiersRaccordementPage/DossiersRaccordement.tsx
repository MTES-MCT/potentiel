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
  dossiersRaccordement: ListeDossiersRaccordementReadModel['références']; // Ajouter le gestionnaire
  codeEIC: ListeDossiersRaccordementReadModel['codeEIC'];
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const DossiersRaccordement = ({
  user,
  dossiersRaccordement,
  gestionnairesRéseau,
  codeEIC,
}: DossiersRaccordementProps) => {
  const gestionnaireActuel = gestionnairesRéseau?.find(
    (gestionnaire) => gestionnaire.codeEIC === codeEIC,
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
          <ListeDossiersRaccordements dossiersRaccordement={dossiersRaccordement} />
        ) : (
          <DemandeComplèteRaccordementForm />
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
  const [gestionnaireSélectionné, setGestionnaireSélectionné] = useState<
    GestionnaireRéseauReadModel | undefined
  >(undefined);

  const [format, setFormat] = useState('');
  const [légende, setLégende] = useState('');

  const handleGestionnaireSéléctionné = (sélection: React.FormEvent<HTMLSelectElement>) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === sélection.currentTarget.value,
    );

    setGestionnaireSélectionné(gestionnaireSélectionné);
    setFormat(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.format || '');
    setLégende(gestionnaireSélectionné?.aideSaisieRéférenceDossierRaccordement.légende || '');
  };

  return (
    <form
      className="flex gap-3 flex-col"
      method="POST"
      action={routes.POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT}
    >
      <div className="flex flex-col gap-4">
        {gestionnairesRéseau && gestionnairesRéseau.length > 0 && (
          <div>
            <Label htmlFor="codeEICGestionnaireRéseau">Gestionnaire de réseau</Label>
            <Select
              id="codeEICGestionnaireRéseau"
              name="codeEICGestionnaireRéseau"
              onChange={(e) => handleGestionnaireSéléctionné(e)}
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
          <Label htmlFor="identifiantGestionnaireRéseau">
            Identifiant du dossier de raccordement du projet * (champ obligatoire)
          </Label>
          {(format || légende) && (
            <InfoBox className="mt-2 mb-3">
              {légende && <p className="m-0">Format attendu : {légende}</p>}
              {format && <p className="m-0 italic">Exemple : {format}</p>}
            </InfoBox>
          )}
          <Input
            type="text"
            id="identifiantGestionnaireRéseau"
            name="identifiantGestionnaireRéseau"
            placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
            required
          />
          <p className="mt-4 mb-0 italic">
            * Où trouver l'identifiant du dossier de raccordement ?
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
  );
};
