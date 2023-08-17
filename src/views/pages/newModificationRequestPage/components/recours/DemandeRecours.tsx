import React from 'react';

import { Input, Label, TextArea, ToutLesChampsObligatoiresLégende } from '../../../../components';

type DemandeRecoursProps = {
  justification: string;
};

export const DemandeRecours = ({ justification }: DemandeRecoursProps) => (
  <>
    <ToutLesChampsObligatoiresLégende />
    <div>
      <Label htmlFor="justification">
        <span className="font-bold">
          Veuillez nous indiquer les raisons qui motivent votre demande
        </span>
        <br />
        <span className="italic">
          Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
          conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
        </span>
      </Label>
      <TextArea
        name="justification"
        id="justification"
        defaultValue={justification || ''}
        required
        aria-required="true"
      />
    </div>
    <div>
      <Label htmlFor="file">
        <span className="font-bold">Pièce justificative</span>
        <br />
        <span className="italic">
          Vous pouvez transmettre un fichier compressé si il y a plusieurs documents
        </span>
      </Label>
      <Input type="file" name="file" id="file" />
    </div>
  </>
);
