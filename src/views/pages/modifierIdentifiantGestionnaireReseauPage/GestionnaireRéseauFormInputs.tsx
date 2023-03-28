import React, { useState } from 'react';

import { ExternalLink, InfoBox, Input, Label, ProjectProps, Select } from '@components';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';

type GestionnaireRéseauFormInputsProps = {
  gestionnaireRéseauActuel?: GestionnaireRéseauReadModel;
  identifiantGestionnaireRéseauActuel?: ProjectProps['identifiantGestionnaire'];
  gestionnairesRéseau?: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const GestionnaireRéseauFormInputs = ({
  gestionnaireRéseauActuel,
  identifiantGestionnaireRéseauActuel,
  gestionnairesRéseau,
}: GestionnaireRéseauFormInputsProps) => {
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
    <div className="flex flex-col gap-4">
      {gestionnairesRéseau && gestionnairesRéseau.length > 0 && (
        <div>
          <Label htmlFor="codeEICGestionnaireRéseau">Gestionnaire de réseau</Label>
          <Select
            id="codeEICGestionnaireRéseau"
            name="codeEICGestionnaireRéseau"
            onChange={(e) => handleGestionnaireSéléctionné(e)}
            defaultValue={gestionnaireRéseauActuel?.codeEIC || 'défaut'}
          >
            <option value="défaut" disabled hidden>
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
          defaultValue={identifiantGestionnaireRéseauActuel || ''}
          required
        />
        <p className="mt-4 mb-0 italic">
          * Où trouver l'identifiant du dossier de raccordement ?
          <br />
          Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre demande
          complète de raccordement (
          <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
            Voir un exemple
          </ExternalLink>
          )
        </p>
      </div>
    </div>
  );
};
