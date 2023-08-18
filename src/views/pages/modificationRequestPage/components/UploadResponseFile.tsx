import React from 'react';
import { DownloadResponseTemplate } from '.';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import { Input, Label } from '../../../components';

interface UploadResponseFileProps {
  modificationRequest: ModificationRequestPageDTO & { type: string };
}

export const UploadResponseFile = ({ modificationRequest }: UploadResponseFileProps) => (
  <>
    <DownloadResponseTemplate modificationRequest={modificationRequest} />
    <div className="form__group">
      <Label htmlFor="file" optionnel={modificationRequest.type === 'puissance' ? true : undefined}>
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
