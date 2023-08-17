import { Input, Label, TextArea } from '../../../../components';
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
    {project.actionnaire && (
      <div>
        Ancien actionnaire : <span className="font-bold">{project.actionnaire}</span>
      </div>
    )}

    <div className="text-error-425-base italic">Tous les champs sont obligatoires</div>
    <div>
      <Label htmlFor="actionnaire" className="font-bold">
        Nouvel actionnaire
      </Label>
      <Input
        type="text"
        name="actionnaire"
        id="actionnaire"
        defaultValue={actionnaire || ''}
        required
        aria-required="true"
      />
    </div>

    <div>
      <Label htmlFor="file">
        <span className="font-bold">Joindre les statuts mis à jour</span>
        <br />
        <span className="italic">
          Vous pouvez transmettre un fichier compressé si il y a plusieurs documents
        </span>
      </Label>
      <Input type="file" name="file" id="file" required aria-required="true" />
    </div>
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
        required
        aria-required="true"
        defaultValue={justification || ''}
      />
    </div>
  </>
);
