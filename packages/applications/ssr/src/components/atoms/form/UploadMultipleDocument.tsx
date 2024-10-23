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

  const browseForFile = () => {
    hiddenFileInput?.current?.click();
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

      <div className="flex items-center relative mt-3 gap-3">
        <input
          name={name}
          required={required}
          aria-required={required}
          ref={hiddenFileInput}
          type="file"
          multiple
          accept={acceptedFormats}
          className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
          onChange={(e) => {
            console.log(e.target.files);
            console.log(e.currentTarget.value);
            const fileName = extractFileName(e.currentTarget.value);

            if (!multipleDocument.includes(fileName)) {
              setMultipleDocument([...multipleDocument, fileName]);
            }
          }}
        />
        <Button className="!mt-0" type="button" priority="secondary" onClick={browseForFile}>
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>

        {multipleDocument.length === 0 && (
          <p className="text-sm truncate m-0 p-0">Aucun document sélectionné</p>
        )}
      </div>
      {multipleDocument.length > 0 && (
        <ul className="flex flex-col mt-3">
          {multipleDocument.map((doc, index) => (
            <li key={index}>
              <span>{doc}</span>
              <Button
                className="ml-2 text-dsfr-text-actionHigh-redMarianne-default"
                type="button"
                priority="tertiary no outline"
                size="small"
                onClick={() => {
                  setMultipleDocument(multipleDocument.filter((_, i) => i !== index));
                }}
              >
                <Icon id="fr-icon-delete-line" size="sm" className="md:mr-1" />
                <span className="hidden md:inline-block text-sm">Supprimer</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const extractFileName = (path: string) => path.replace(/^.*[\\/]/, '');
