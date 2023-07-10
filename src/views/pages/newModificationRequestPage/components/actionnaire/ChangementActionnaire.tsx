import { Input, Label, TextArea } from '@components';
import React from 'react';

type ChangementActionnaireProps = {
  project: { actionnaire?: string };
  actionnaire: string;
  justification: string;
};

export const ChangementActionnaire = ({
  project,
  actionnaire,
  justification,
}: ChangementActionnaireProps) => (
  <>
    {project.actionnaire && <p>Ancien actionnaire : {project.actionnaire}</p>}
    <div>
      <Label htmlFor="actionnaire" className="mt-4" required>
        Nouvel actionnaire
      </Label>
      <Input
        type="text"
        name="actionnaire"
        id="actionnaire"
        required
        defaultValue={actionnaire || ''}
      />
    </div>
    <div>
      <Label htmlFor="file">Joindre les statuts mis à jour</Label>
      <Input type="file" name="file" id="file" />
    </div>
    <div>
      <Label htmlFor="justification">
        <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
        <br />
        Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit
        à ce besoin de modification (contexte, facteurs extérieurs, etc)
      </Label>
      <TextArea name="justification" id="justification" defaultValue={justification || ''} />
    </div>
  </>
);
