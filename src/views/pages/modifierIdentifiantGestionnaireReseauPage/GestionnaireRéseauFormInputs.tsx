import React, { useState } from 'react';

import { InfoBox, Input, Label, ProjectProps, Select } from '@components';

type GestionnaireRéseauFormInputsProps = {
  gestionnaireRéseauActuel?: ProjectProps['gestionnaireRéseau'];
  identifiantGestionnaireRéseauActuel?: ProjectProps['identifiantGestionnaire'];
  listeGestionnairesRéseau?: {
    codeEIC: string;
    raisonSociale: string;
    format?: string;
    légende?: string;
  }[];
};

export const GestionnaireRéseauFormInputs = ({
  gestionnaireRéseauActuel,
  identifiantGestionnaireRéseauActuel,
  listeGestionnairesRéseau,
}: GestionnaireRéseauFormInputsProps) => {
  const gestionnaireActuel = listeGestionnairesRéseau?.find(
    (gestionnaire) => gestionnaire.codeEIC === gestionnaireRéseauActuel?.codeEIC,
  );

  const [format, setFormat] = useState(gestionnaireActuel?.format || '');
  const [légende, setLégende] = useState(gestionnaireActuel?.légende || '');

  const handleGestionnaireSéléctionné = (sélection: React.FormEvent<HTMLSelectElement>) => {
    const gestionnaireSélectionné = listeGestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === sélection.currentTarget.value,
    );

    gestionnaireSélectionné && gestionnaireSélectionné.format
      ? setFormat(gestionnaireSélectionné.format)
      : setFormat('');

    gestionnaireSélectionné && gestionnaireSélectionné.légende
      ? setLégende(gestionnaireSélectionné.légende)
      : setLégende('');
  };

  return (
    <div className="flex flex-col gap-4">
      {listeGestionnairesRéseau && listeGestionnairesRéseau.length > 0 && (
        <div>
          <Label htmlFor="codeEICGestionnaireRéseau">Gestionnaire de réseau</Label>
          <Select
            id="codeEICGestionnaireRéseau"
            name="codeEICGestionnaireRéseau"
            onChange={(e) => handleGestionnaireSéléctionné(e)}
          >
            <option selected disabled hidden>
              Sélectionnez votre gestionnaire de réseau
            </option>
            {listeGestionnairesRéseau.map(({ codeEIC, raisonSociale }) => (
              <option
                value={codeEIC}
                key={codeEIC}
                selected={codeEIC === gestionnaireRéseauActuel?.codeEIC}
              >
                {raisonSociale} (code EIC : {codeEIC})
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="identifiantGestionnaireRéseau">
          Identifiant de gestionnaire réseau du projet (champ obligatoire)
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
      </div>
    </div>
  );
};
