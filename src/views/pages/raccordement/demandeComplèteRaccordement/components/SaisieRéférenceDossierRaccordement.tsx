import { InfoBox, Input, Label } from '@components';
import React from 'react';

type SaisieRéférenceDossierRaccordementProps = {
  format?: string;
  légende?: string;
  référenceActuelle?: string;
};
export const SaisieRéférenceDossierRaccordement = ({
  format,
  légende,
  référenceActuelle,
}: SaisieRéférenceDossierRaccordementProps) => (
  <div>
    <Label htmlFor="referenceDossierRaccordement">
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
      id="referenceDossierRaccordement"
      name="referenceDossierRaccordement"
      placeholder={format ? `Exemple: ${format}` : `Renseigner l'identifiant`}
      required
      value={référenceActuelle ?? ''}
    />
  </div>
);
