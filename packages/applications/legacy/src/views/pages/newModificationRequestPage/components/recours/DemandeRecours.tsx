import React from 'react';

import {
  Label,
  TextArea,
  ChampsObligatoiresLégende,
  LabelDescription,
  InputFile,
} from '../../../../components';

type DemandeRecoursProps = {
  justification: string;
};

export const DemandeRecours = ({ justification }: DemandeRecoursProps) => (
  <>
    <ChampsObligatoiresLégende />
    <div>
      <Label htmlFor="justification">
        Veuillez nous indiquer les raisons qui motivent votre demande
      </Label>
      <LabelDescription>
        Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit
        à ce besoin de modification (contexte, facteurs extérieurs, etc)
      </LabelDescription>
      <TextArea
        name="justification"
        id="justification"
        defaultValue={justification || ''}
        required
        aria-required="true"
      />
    </div>
    <div>
      <Label htmlFor="file">Pièce justificative</Label>
      <LabelDescription>
        Vous pouvez transmettre un fichier compressé si il y a plusieurs documents
      </LabelDescription>
      <InputFile />
    </div>
  </>
);
