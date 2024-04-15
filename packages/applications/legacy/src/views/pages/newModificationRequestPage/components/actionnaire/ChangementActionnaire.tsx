import React from 'react';
import {
  Callout,
  ChampsObligatoiresLégende,
  Input,
  Label,
  LabelDescription,
  TextArea,
} from '../../../../components';

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
      <Callout>
        Ancien actionnaire : <span className="font-bold">{project.actionnaire}</span>
      </Callout>
    )}

    <ChampsObligatoiresLégende />
    <div>
      <Label htmlFor="actionnaire">Nouvel actionnaire</Label>
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
      <Label htmlFor="file">Joindre les statuts mis à jour</Label>
      <LabelDescription>
        Vous pouvez transmettre un fichier compressé si il y a plusieurs documents
      </LabelDescription>
      <Input type="file" name="file" id="file" required aria-required="true" />
    </div>
    <div>
      <Label htmlFor="justification" optionnel={true}>
        Veuillez nous indiquer les raisons qui motivent votre demande
      </Label>
      <LabelDescription>
        Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit
        à ce besoin de modification (contexte, facteurs extérieurs, etc)
      </LabelDescription>
      <TextArea name="justification" id="justification" defaultValue={justification || ''} />
    </div>
  </>
);
