import React from 'react';
import { DownloadResponseTemplate } from '.';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import { Input, Label } from '../../../components';

interface UploadResponseFileProps {
  modificationRequest: ModificationRequestPageDTO & { type: string };
  optionnel?: true;
  reasonForOptionnel?: string;
}

export const UploadResponseFile = ({
  modificationRequest,
  optionnel = undefined,
  reasonForOptionnel,
}: UploadResponseFileProps) => (
  <div className="flex flex-col gap-2">
    <div className="form__group">
      <Label htmlFor="file" optionnel={optionnel} reasonForOptionnel={reasonForOptionnel}>
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
    <DownloadResponseTemplate modificationRequest={modificationRequest} />
  </div>
);
