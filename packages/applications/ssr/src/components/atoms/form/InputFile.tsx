import React, { useState } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '../Icon';

type InputFileProps = {
  name: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  documentKey?: string;
  onFileChange?: (fileName: string) => void;
};

export const InputFile = ({ documentKey, onFileChange, ...props }: InputFileProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => {
    setIsModificationActivated(true);
    hiddenFileInput?.current?.click();
  };
  const [uploadedFileName, setUploadFileName] = useState('');

  const [isModificationActivated, setIsModificationActivated] = useState(false);

  return (
    <div
      className={`flex mr-auto items-center mt-2 p-3 bg-grey-950-base border-0 border-b-2 border-solid border-gray-600 relative ${
        props.disabled && 'cursor-not-allowed border-b-grey-925-base bg-grey-950-base'
      }`}
    >
      <input
        {...props}
        ref={hiddenFileInput}
        type="file"
        className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
        onChange={(e) => {
          const fileName = e.currentTarget.value.replace(/^.*[\\\/]/, '');
          setUploadFileName(fileName);
          setIsModificationActivated(true);
          onFileChange && onFileChange(fileName);
        }}
        disabled={!isModificationActivated}
      />
      <input {...props} type="text" hidden value={documentKey} disabled={isModificationActivated} />

      <div className="truncate mr-5">
        {uploadedFileName ? (
          uploadedFileName
        ) : documentKey ? (
          <>
            Fichier déjà transmis (
            <Link href={Routes.Document.télécharger(documentKey)} target="_blank">
              Télécharger
            </Link>
            )
          </>
        ) : (
          'Aucun fichier sélectionné'
        )}
      </div>

      {!props.disabled && (
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center text-base border-none bg-transparent hover:bg-transparent m-0 p-0"
            onClick={browseForFile}
          >
            {documentKey || uploadedFileName ? (
              <>
                <Icon id="fr-icon-pencil-fill" className="md:mr-1" />
                <span className="hidden md:inline-block text-sm">Modifier</span>
              </>
            ) : (
              <>
                <Icon id="fr-icon-add-circle-line" className="md:mr-1" />
                <span className="hidden md:inline-block text-sm">Ajouter</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
