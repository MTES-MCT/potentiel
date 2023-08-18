import React from 'react';
import { DownloadResponseTemplate } from '.';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import { Input, Label } from '../../../components';

interface UploadResponseFileProps {
  modificationRequest: ModificationRequestPageDTO & { type: string };
  optionnel?: true;
}

export const UploadResponseFile = ({
  modificationRequest,
  optionnel = undefined,
}: UploadResponseFileProps) => (
  <>
    <DownloadResponseTemplate modificationRequest={modificationRequest} />
    <div className="form__group">
      <Label htmlFor="file" optionnel={optionnel}>
        Réponse signée (fichier pdf)
      </Label>
      <Input
        type="file"
        name="file"
        id="file"
        required={modificationRequest.type !== 'puissance'}
        aria-required={modificationRequest.type !== 'puissance'}
      />
    </div>
  </>
);
