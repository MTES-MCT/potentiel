import { GestionnaireRéseauReadModel } from '@potentiel/domain';
import { Label, Select } from '@components';
import React from 'react';

export const GestionnaireRéseauSelect = ({
  gestionnairesRéseau,
  gestionnaireRéseauActuel,
  onGestionnaireRéseauSelected,
}: {
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  gestionnaireRéseauActuel?: GestionnaireRéseauReadModel;
  onGestionnaireRéseauSelected?: (aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
  }) => void;
}) => {
  const handleGestionnaireSéléctionné = (codeEIC: string) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === codeEIC,
    );

    if (gestionnaireSélectionné) {
      const { aideSaisieRéférenceDossierRaccordement } = gestionnaireSélectionné;
      onGestionnaireRéseauSelected &&
        onGestionnaireRéseauSelected(aideSaisieRéférenceDossierRaccordement);
    }
  };

  return (
    <>
      <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
      <Select
        id="codeEIC"
        name="codeEIC"
        onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
        defaultValue={gestionnaireRéseauActuel?.codeEIC ?? 'none'}
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
    </>
  );
};
