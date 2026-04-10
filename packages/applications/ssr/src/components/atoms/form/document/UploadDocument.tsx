import React, { FC, useState } from 'react';
import { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import Link from 'next/link';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { fr } from '@codegouvfr/react-dsfr';

import { fileSizeLimitInMegaBytes } from '@/utils/zod/blob/cannotExceedSize';

import { Icon } from '../../Icon';

export type UploadDocumentProps = {
  className?: string;
  label: React.ReactNode;
  name: string;
  formats: Array<'pdf' | 'jpg' | 'jpeg' | 'png' | 'csv'>;
  required?: boolean;
  disabled?: boolean;
  state?: RadioButtonsProps['state'];
  stateRelatedMessage?: React.ReactNode;
  hintText?: string;
  multiple?: true;
  onChange?: (filenames: Array<string>) => void;
};

/**
 *
 * @description Merci de ne pas utiliser ce composant directement dans un formulaire, mais de passer par le composant <UploadNewOrModifyExistingDocument />.
 */
export const UploadDocument: FC<UploadDocumentProps> = ({
  className,
  state,
  stateRelatedMessage,
  label,
  name,
  formats,
  hintText,
  required,
  multiple,
  onChange,
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const acceptedFormats = formats.map((format) => `.${format}`).join(',');

  const extractFileName = (path: string) => path.replace(/^.*[\\/]/, '');
  const [invalid, setInvalid] = useState(false);

  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;

    setInvalid(false);

    if (!files || Object.keys(files).length === 0) {
      setDocumentFilenames([]);
      return;
    }

    const fileNames = Object.values(files).map((file) => extractFileName(file.name));

    setDocumentFilenames(fileNames);
    if (onChange) {
      onChange(fileNames);
    }
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
    const updatedFilenames = documentFilenames.filter((_, i) => i !== index);

    setDocumentFilenames(updatedFilenames);
    if (onChange) {
      onChange(updatedFilenames);
    }
  };

  const handleRemoveAllFiles = () => {
    if (!hiddenFileInput.current || !hiddenFileInput.current.files) {
      return;
    }

    hiddenFileInput.current.files = new DataTransfer().files;

    setDocumentFilenames([]);
    if (onChange) {
      onChange([]);
    }
  };

  const [documentFilenames, setDocumentFilenames] = useState<Array<string>>([]);

  const [modal] = useState(
    createModal({
      id: `form-modal-files-to-upload-${name}`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <div className={clsx('fr-input-group', className)}>
      {label && (
        <label className={clsx('fr-label', state === 'error' && 'text-theme-error')}>{label}</label>
      )}
      <div className="fr-hint-text">
        Taille maximale : <span className="font-semibold">{fileSizeLimitInMegaBytes} Mo</span>,
        Format(s) supporté(s) : <span className="font-semibold">{formats.join(', ')}</span>.
        {multiple && <> Plusieurs fichiers possibles</>}
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
          className="w-0 -z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
          onChange={handleFileChange}
          // NB: le comportement diffère selon les navigateurs.
          // Dans Chrome, il n'y a aucune feedback si le fichier est manquant
          // On utilise donc ce callback pour gérer le feedback manuellement
          onInvalid={() => setInvalid(true)}
        />
        <Button className="!mt-0" type="button" priority="secondary" onClick={browseForFile}>
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>

        <div
          className={clsx(
            'text-sm truncate m-0 p-0',
            fr.colors.decisions.text.actionHigh.grey.default,
            { [fr.cx('fr-error-text')]: invalid },
          )}
        >
          {documentFilenames.length === 0 && 'Aucun document sélectionné'}
          {documentFilenames.length === 1 && (
            <div className="flex flex-row items-center gap-2">
              <span
                className="max-w-[300px] flex-1 overflow-hidden truncate text-ellipsis"
                title={documentFilenames[0]}
              >
                {documentFilenames[0]}
              </span>
              <Button
                type="button"
                size="small"
                priority="tertiary no outline"
                iconId="fr-icon-delete-bin-line"
                onClick={() => handleFileRemove(0)}
              >
                supprimer
              </Button>
            </div>
          )}
          {documentFilenames.length > 1 && (
            <>
              <div>{documentFilenames.length} documents sélectionnés</div>
              <Link href="#" onClick={() => modal.open()}>
                Voir les fichiers sélectionnés
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
                        className="ml-auto"
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
      {state === 'error' ? (
        <div className="flex flex-row gap-2 items-center mt-2">
          <Icon id="fr-icon-error-fill" className="text-theme-error" size="sm" />
          <p className="truncate p-0 text-theme-error text-xs">{stateRelatedMessage}</p>
        </div>
      ) : (
        <p className="text-sm truncate p-0 fr-hint-text">{stateRelatedMessage}</p>
      )}
    </div>
  );
};
