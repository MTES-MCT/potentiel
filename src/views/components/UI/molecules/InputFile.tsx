import React, { useState } from 'react';
import { DownloadLink } from './DownloadLink';
import { AddIcon, EditIcon } from '../atoms';

type InputFileProps = {
  name: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  fileUrl?: string;
  onFileChange?: (fileName: string) => void;
};

export const InputFile = ({ fileUrl, onFileChange, ...props }: InputFileProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => hiddenFileInput?.current?.click();
  const [uploadedFileName, setUploadFileName] = useState('');

  return (
    <div
      className={`flex items-center mt-2 p-3 bg-grey-950-base border-0 border-b-2 border-solid border-gray-600 relative ${
        props.disabled && 'cursor-not-allowed border-b-grey-925-base bg-grey-950-base'
      }`}
    >
      <input
        {...props}
        ref={hiddenFileInput}
        type="file"
        className="-z-50 opacity-0 w-full h-full absolute top-0 left-0"
        onChange={(e) => {
          const fileName = e.currentTarget.value.replace(/^.*[\\\/]/, '');
          setUploadFileName(fileName);
          onFileChange && onFileChange(fileName);
        }}
      />

      <div className="truncate mr-5">
        {uploadedFileName ? (
          uploadedFileName
        ) : fileUrl ? (
          <>
            Fichier déjà transmis (<DownloadLink fileUrl={fileUrl}>Télécharger</DownloadLink>)
          </>
        ) : (
          'Aucun fichier sélectionné'
        )}
      </div>

      {!props.disabled && (
        <div className="flex ml-auto gap-3">
          <button
            type="button"
            className="flex items-center text-base border-none bg-transparent hover:bg-transparent hover:cursor-pointer m-0 p-0"
            onClick={browseForFile}
          >
            {fileUrl || uploadedFileName ? (
              <>
                <EditIcon className="md:mr-1" />
                <span className="hidden md:inline-block text-sm">Modifier</span>
              </>
            ) : (
              <>
                <AddIcon className="md:mr-1" />
                <span className="hidden md:inline-block text-sm">Ajouter</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
