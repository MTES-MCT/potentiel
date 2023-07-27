import React, { useState } from 'react';
import { DownloadLink, EditIcon, AddIcon } from '@components';

type InputFileProps = {
  name: string;
  id?: string;
  required?: true;
  disabled?: true;
  fileUrl?: string;
};

export const InputFile = ({ fileUrl, ...props }: InputFileProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => hiddenFileInput?.current?.click();
  const [uploadedFileName, setUploadFileName] = useState('');

  return (
    <div className="flex items-center mt-2 p-3 bg-grey-950-base border-0 border-b-2 border-solid border-gray-600 relative">
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

      <div className="flex ml-auto gap-3">
        <button
          type="button"
          className="flex items-center text-base border-none bg-transparent hover:bg-transparent m-0 p-0"
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

      <input
        {...props}
        ref={hiddenFileInput}
        type="file"
        className="opacity-0 w-full h-full absolute top-0 left-0"
        onChange={(e) => setUploadFileName(e.currentTarget.value.replace(/^.*[\\\/]/, ''))}
      />
    </div>
  );
};
