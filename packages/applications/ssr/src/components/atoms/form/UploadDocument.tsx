import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import RadioButtons, { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '../Icon';

export type UploadDocumentProps = {
  label: React.ReactNode;
  stateRelatedMessage?: React.ReactNode;
  name: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  documentKey?: string;
  onFileChange?: (fileName: string) => void;
};

export const UploadDocument = ({
  label,
  disabled,
  documentKey,
  onFileChange,
  ...props
}: UploadDocumentProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };
  const [uploadedFileName, setUploadFileName] = useState('');
  const [documentSelection, setDocumentSelection] = useState<
    'keep_existing_document' | 'upload_new_document'
  >(documentKey ? 'keep_existing_document' : 'upload_new_document');

  const options: RadioButtonsProps['options'] = [];

  if (documentKey) {
    options.push({
      label: (
        <div>
          Garder le document existant (
          <Link href={Routes.Document.télécharger(documentKey)} target="_blank">
            télécharger
          </Link>
          )
          {documentSelection === 'keep_existing_document' && (
            <input {...props} type="text" hidden value={documentKey} />
          )}
        </div>
      ),
      nativeInputProps: {
        checked: documentSelection === 'keep_existing_document',
        onChange: () => setDocumentSelection('keep_existing_document'),
        value: 'keep_existing_document',
      },
    });
  }

  options.push({
    label: (
      <div className={`flex items-center relative top-[-0.5rem]`}>
        {documentSelection === 'upload_new_document' && (
          <input
            {...props}
            ref={hiddenFileInput}
            type="file"
            accept=".pdf"
            className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
            onChange={(e) => {
              const fileName = e.currentTarget.value.replace(/^.*[\\\/]/, '');
              setUploadFileName(fileName);
              onFileChange && onFileChange(fileName);
            }}
          />
        )}

        <div className="flex flex-col">
          <div className="truncate mr-5">
            {uploadedFileName
              ? uploadedFileName
              : documentKey
              ? `Modifier le doument existant`
              : 'Téléverser un document'}
          </div>
          <div>
            <span className="text-xs">Format accepté : pdf</span>
          </div>
        </div>

        <Button
          type="button"
          priority="secondary"
          onClick={browseForFile}
          disabled={documentSelection === 'keep_existing_document'}
        >
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>
      </div>
    ),
    nativeInputProps: {
      checked: documentSelection === 'upload_new_document',
      onChange: () => setDocumentSelection('upload_new_document'),
      value: 'upload_new_document',
    },
  });

  return (
    <RadioButtons
      legend={label}
      name={`${props.name}_document_selector`}
      disabled={disabled}
      options={options}
      state="default"
      stateRelatedMessage={props.stateRelatedMessage}
    />
  );
};
