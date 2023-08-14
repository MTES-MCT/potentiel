import { Input, Label, LabelDescription } from '../../../components';
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
      <LabelDescription>Exemple : XXX-RP-AAAA-999999</LabelDescription>
      <Input type="text" id="format" name="format" defaultValue={format || ''} />
    </div>

    <div>
      <Label htmlFor="légende">Aide à la saisie de l'identifiant du dossier de raccordement</Label>
      <LabelDescription>
        Exemple : X = caractère alphabétique en majuscule, AAAA = Année, 9 = caractère numérique de
        0 à 9
      </LabelDescription>
      <Input type="text" id="légende" name="légende" defaultValue={légende || ''} />
    </div>
  </>
);
