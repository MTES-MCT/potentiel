import React, { FC, useState } from 'react';
import { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';

import { DEFAULT_FILE_SIZE_LIMIT_IN_MB } from '@/utils/zod/documentTypes';

import { Icon } from '../Icon';

export type UploadMultipleDocumentProps = {
  className?: string;
  label: React.ReactNode;
  name: string;
  /**
  Si utilisé dans un formulaire
  l'id ne doit pas comprendre d'accent
  */
  id?: string;
  required?: boolean;
  disabled?: boolean;
  state?: RadioButtonsProps['state'];
  stateRelatedMessage?: React.ReactNode;
  formats?: Array<'pdf' | 'jpg' | 'jpeg' | 'png'>;
  hintText?: string;
};

export const UploadMultipleDocument: FC<UploadMultipleDocumentProps> = ({
  className,
  state,
  label,
  name,
  formats = ['pdf', 'jpeg', 'jpg', 'png'],
  hintText,
  required,
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const acceptedFormats = formats.map((format) => `.${format}`).join(',');

  const extractFileName = (path: string) => path.replace(/^.*[\\/]/, '');

  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;

    if (!files || Object.keys(files).length === 0) {
      setMultipleDocument([]);
      return;
    }

    const fileNames = Object.values(files)
      .map((file) => {
        const fileName = extractFileName(file.name);

        if (multipleDocument.includes(fileName)) {
          return undefined;
        }

        return fileName;
      })
      .filter((f) => f !== undefined);

    setMultipleDocument([...multipleDocument, ...fileNames]);
  };

  const handleFileRemove = (index: number) => {
    if (!hiddenFileInput.current || !hiddenFileInput.current.files) {
      return;
    }

    const dataTransfer = new DataTransfer();

    Array.from(hiddenFileInput.current.files).forEach((file, i) => {
      if (i !== index) {
        dataTransfer.items.add(file);
      }
    });

    hiddenFileInput.current.files = dataTransfer.files;
    setMultipleDocument(multipleDocument.filter((_, i) => i !== index));
  };

  const handleRemoveAllFiles = () => {
    if (!hiddenFileInput.current || !hiddenFileInput.current.files) {
      return;
    }

    hiddenFileInput.current.files = null;
    setMultipleDocument([]);
  };

  const [multipleDocument, setMultipleDocument] = useState<Array<string>>([]);

  return (
    <div className={clsx('fr-input-group', className && `${className}`)}>
      <label className={clsx('fr-label', state === 'error' && 'text-theme-error')}>{label}</label>
      <div className="fr-hint-text">
        Formats accepté : <span className="font-semibold">{formats.join(', ')}</span>, taille
        maximale acceptée :{' '}
        <span className="font-semibold">{DEFAULT_FILE_SIZE_LIMIT_IN_MB} Mo</span>
      </div>
      {hintText && <div className="fr-hint-text">{hintText}</div>}

      <div
        className={`flex ${multipleDocument.length === 0 ? 'items-center' : 'items-start'} justify-start relative mt-3 gap-3`}
      >
        <input
          name={name}
          required={required}
          aria-required={required}
          ref={hiddenFileInput}
          type="file"
          multiple
          accept={acceptedFormats}
          className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
          onChange={handleFileChange}
        />
        <Button className="!mt-0" type="button" priority="secondary" onClick={browseForFile}>
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>

        {multipleDocument.length === 0 ? (
          <p className="text-sm truncate m-0 p-0">Aucun document sélectionné</p>
        ) : (
          <Button
            className="ml-2 text-dsfr-text-actionHigh-redMarianne-default"
            type="button"
            priority="tertiary no outline"
            onClick={() => handleRemoveAllFiles()}
          >
            <Icon id="fr-icon-delete-line" size="sm" className="md:mr-1" />
            <span className="hidden md:inline-block text-sm">Supprimer tout les documents</span>
          </Button>
        )}
      </div>
      {multipleDocument.length > 0 && (
        <div className="mt-8">
          <span className="font-semibold">{multipleDocument.length}</span> document
          {multipleDocument.length > 1 ? 's' : ''} sélectionné
          {multipleDocument.length > 1 ? 's' : ''}
          <ul className="flex flex-col mt-3 gap-0 w-full">
            {multipleDocument.map((doc, index) => (
              <li key={index} className="flex gap-2 items-center text-sm text-ellipsis">
                <div className="min-w-40 truncate">{doc}</div>
                <Button
                  className="ml-2 text-dsfr-text-actionHigh-redMarianne-default"
                  type="button"
                  priority="tertiary no outline"
                  size="small"
                  onClick={() => handleFileRemove(index)}
                >
                  <Icon id="fr-icon-delete-line" size="sm" className="md:mr-1" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
