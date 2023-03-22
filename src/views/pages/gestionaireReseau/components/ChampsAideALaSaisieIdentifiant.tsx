import { InfoBox, Input, Label } from '@components';
import React from 'react';

export const ChampsAideALaSaisieIdentifiant = ({
  format,
  légende,
}: {
  format?: string;
  légende?: string;
}) => (
  <>
    <div>
      <Label htmlFor="format">Format de l'identifiant du dossier de raccordement</Label>
      <Input type="text" id="format" name="format" defaultValue={format || ''} />
      <InfoBox className="mt-2 italic">Exemple : XXX-RP-AAAA-999999</InfoBox>
    </div>
    <div>
      <Label htmlFor="légende">Aide à la saisie de l'identifiant du dossier de raccordement</Label>
      <Input type="text" id="légende" name="légende" defaultValue={légende || ''} />
      <InfoBox className="mt-2 italic">
        Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de
        0 à 9
      </InfoBox>
    </div>
  </>
);
