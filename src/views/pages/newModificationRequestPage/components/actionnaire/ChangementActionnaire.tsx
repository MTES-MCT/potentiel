import { Input, Label, TextArea } from '@components';
import React from 'react';
import { dataId } from '../../../../../helpers/testId';

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
      <>
        <Label htmlFor="ancien-actionnaire">Ancien actionnaire</Label>
        <Input
          type="text"
          disabled
          defaultValue={project.actionnaire}
          name="ancien-actionnaire"
          id="ancien-actionnaire"
        />
      </>
    )}
    <Label htmlFor="actionnaire" className="mt-4" required>
      Nouvel actionnaire
    </Label>
    <Input
      type="text"
      name="actionnaire"
      id="actionnaire"
      required
      defaultValue={actionnaire || ''}
      {...dataId('modificationRequest-actionnaireField')}
    />
    <Label htmlFor="candidats" className="mt-4">
      Statuts mis à jour
    </Label>
    <Input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
    <Label htmlFor="justification" className="mt-4">
      <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
      <br />
      Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit à
      ce besoin de modification (contexte, facteurs extérieurs, etc)
    </Label>
    <TextArea
      name="justification"
      id="justification"
      defaultValue={justification || ''}
      {...dataId('modificationRequest-justificationField')}
    />
  </>
);
