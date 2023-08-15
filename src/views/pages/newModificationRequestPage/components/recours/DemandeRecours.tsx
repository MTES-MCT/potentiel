import React from 'react';

import { Input, Label, TextArea } from '../../../../components';

type DemandeRecoursProps = {
  justification: string;
};

export const DemandeRecours = ({ justification }: DemandeRecoursProps) => (
  <>
    <div>
      <Label htmlFor="justification">
        <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
        <br />
        Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit
        à ce besoin de modification (contexte, facteurs extérieurs, etc)
      </Label>
      <TextArea name="justification" id="justification" defaultValue={justification || ''} />
    </div>
    <div>
      <Label htmlFor="file">Pièce justificative (si nécessaire)</Label>
      <Input type="file" name="file" id="file" />
    </div>
  </>
);
