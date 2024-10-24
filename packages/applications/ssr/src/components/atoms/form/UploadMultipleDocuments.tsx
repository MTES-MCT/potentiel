import React, { FC, useState } from 'react';
import { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import Link from 'next/link';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { DEFAULT_FILE_SIZE_LIMIT_IN_MB } from '@/utils/zod/documentTypes';

import { Icon } from '../Icon';

export type UploadMultipleDocumentsProps = {
  className?: string;
  label: React.ReactNode;
  name: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  state?: RadioButtonsProps['state'];
  stateRelatedMessage?: React.ReactNode;
  formats?: Array<'pdf' | 'jpg' | 'jpeg' | 'png'>;
  hintText?: string;
  multiple?: true;
};

export const UploadMultipleDocuments: FC<UploadMultipleDocumentsProps> = ({
  className,
  state,
  label,
  name,
  formats = ['pdf', 'jpeg', 'jpg', 'png'],
  hintText,
  required,
  multiple,
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
      setDocumentFilenames([]);
      return;
    }

    const fileNames = Object.values(files)
      .map((file) => {
        const fileName = extractFileName(file.name);

        if (documentFilenames.includes(fileName)) {
          return undefined;
        }

        return fileName;
      })
      .filter((f) => f !== undefined);

    setDocumentFilenames([...documentFilenames, ...fileNames]);
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
    setDocumentFilenames(documentFilenames.filter((_, i) => i !== index));
  };

  const handleRemoveAllFiles = () => {
    if (!hiddenFileInput.current || !hiddenFileInput.current.files) {
      return;
    }

    hiddenFileInput.current.files = null;
    setDocumentFilenames([]);
  };

  const [documentFilenames, setDocumentFilenames] = useState<Array<string>>([]);

  const [modal] = useState(
    createModal({
      id: `form-modal-files-${name}`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <div className={clsx('fr-input-group', className && `${className}`)}>
      <label className={clsx('fr-label', state === 'error' && 'text-theme-error')}>{label}</label>
      <div className="fr-hint-text">
        Formats accepté : <span className="font-semibold">{formats.join(', ')}</span>, taille
        maximale acceptée :{' '}
        <span className="font-semibold">{DEFAULT_FILE_SIZE_LIMIT_IN_MB} Mo</span>
      </div>
      {hintText && <div className="fr-hint-text">{hintText}</div>}

      <div className="flex flex-row mt-3 gap-3 items-center">
        <input
          name={name}
          required={required}
          aria-required={required}
          ref={hiddenFileInput}
          type="file"
          multiple={multiple}
          accept={acceptedFormats}
          className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
          onChange={handleFileChange}
        />
        <Button className="!mt-0" type="button" priority="secondary" onClick={browseForFile}>
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>

        <div className={clsx('text-sm truncate m-0 p-0', state === 'error' && 'text-theme-error')}>
          {documentFilenames.length === 0 && 'Aucun document sélectionné'}
          {documentFilenames.length === 1 && documentFilenames[0]}
          {documentFilenames.length > 1 && (
            <>
              <div>{documentFilenames.length} documents séléctionnés</div>
              <Link href="#" onClick={() => modal.open()}>
                Voir les fichiers sélectionnées
              </Link>

              <modal.Component title="Fichiers sélectionnés">
                <ul className="flex flex-col mt-4 w-full">
                  {documentFilenames.map((doc, index) => (
                    <li
                      key={doc}
                      className="flex flex-row text-sm items-center px-3 border-b-[1px] border-b-dsfr-border-default-grey-default"
                    >
                      <div className="truncate">{doc}</div>

                      <Button
                        type="button"
                        size="small"
                        priority="tertiary no outline"
                        iconId="fr-icon-delete-bin-line"
                        onClick={() => handleFileRemove(index)}
                      >
                        supprimer
                      </Button>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-row-reverse mt-5">
                  <Button
                    type="button"
                    size="small"
                    priority="tertiary no outline"
                    iconId="fr-icon-delete-bin-line"
                    onClick={() => {
                      handleRemoveAllFiles();
                      modal.close();
                    }}
                  >
                    Supprimer tous les documents
                  </Button>
                </div>
              </modal.Component>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
