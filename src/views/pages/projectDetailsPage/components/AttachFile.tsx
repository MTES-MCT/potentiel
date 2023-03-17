import React, { useState } from 'react';
import ROUTES from '@routes';
import {
  Button,
  SecondaryButton,
  Input,
  TextArea,
  FormulaireChampsObligatoireLégende,
  Astérisque,
  PaperClipIcon,
  Link,
  Label,
} from '@components';

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
        <form
          action={ROUTES.ATTACHER_FICHIER_AU_PROJET_ACTION}
          method="post"
          encType="multipart/form-data"
          className="mt-2 border border-solid border-gray-300 rounded-md p-5"
        >
          <FormulaireChampsObligatoireLégende className="text-right" />
          <input type="hidden" name="projectId" value={projectId} />
          <div>
            <label htmlFor="date">
              Date d'effet
              <Astérisque />
            </label>
            <Input type="date" required id="date" name="date" />
          </div>
          <div className="mt-2">
            <label htmlFor="title">
              Titre
              <Astérisque />
            </label>
            <Input type="text" name="title" id="title" required />
          </div>
          <div className="mt-2">
            <label htmlFor="description">Description</label>
            <TextArea name="description" id="description" />
          </div>
          <div className="mt-2">
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
          <Button className="mt-2 mr-2" type="submit" name="submit">
            Envoyer
          </Button>
          <Link
            onClick={() => {
              setFormVisible(false);
              setFileCount(1);
            }}
          >
            Annuler
          </Link>
        </form>
      )}
    </div>
  );
};
