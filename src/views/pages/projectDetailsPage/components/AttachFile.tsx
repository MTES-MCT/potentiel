import React, { useState } from 'react';
import ROUTES from '../../../../routes';
import {
  PrimaryButton,
  SecondaryButton,
  Input,
  TextArea,
  PaperClipIcon,
  Link,
  Label,
  Form,
  CertainsChampsObligatoireLégende,
} from '../../../components';

type AttachFileProps = {
  projectId: string;
};
export const AttachFile = ({ projectId }: AttachFileProps) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [fileCount, setFileCount] = useState(1);

  return (
    <div>
      {!isFormVisible && (
        <SecondaryButton
          className="inline-block pl-1 grow whitespace-nowrap text-center lg:max-w-fit self-start m-0"
          onClick={() => setFormVisible(true)}
        >
          <PaperClipIcon className="h-5 w-5 align-middle mx-2" />
          Attacher un fichier
        </SecondaryButton>
      )}
      {isFormVisible && (
        <Form
          action={ROUTES.ATTACHER_FICHIER_AU_PROJET_ACTION}
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5"
        >
          <CertainsChampsObligatoireLégende />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <Label htmlFor="date" required>
              Date d'effet
            </Label>
            <Input type="date" required id="date" name="date" />
          </div>
          <div>
            <Label htmlFor="title" required>
              Titre
            </Label>
            <Input type="text" name="title" id="title" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea name="description" id="description" />
          </div>
          <div>
            <Label htmlFor="file" required>
              Fichier(s) à attacher
            </Label>
            {Array.from({ length: fileCount }, (v, i) => i).map((i) => (
              <Input key={`file_${i}`} type="file" name="file" id="file" />
            ))}
            <Link onClick={() => setFileCount(fileCount + 1)}>+ Ajouter un autre fichier</Link>
          </div>
          <div className="text-sm mt-4">
            Les fichiers attachés sont visibles de l'administration et du porteur de projet.
          </div>
          <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
            <PrimaryButton className="mt-2 mr-2" type="submit" name="submit">
              Envoyer
            </PrimaryButton>
            <Link
              onClick={() => {
                setFormVisible(false);
                setFileCount(1);
              }}
            >
              Annuler
            </Link>
          </div>
        </Form>
      )}
    </div>
  );
};
