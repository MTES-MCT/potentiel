import React, { FC, useState } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import RadioButtons, { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '../Icon';

export type UploadDocumentProps = {
  className?: string;
  label: React.ReactNode;
  name: string;
  id?: string;
  documentKey?: string;
  required?: boolean;
  disabled?: boolean;
  state?: RadioButtonsProps['state'];
  stateRelatedMessage?: React.ReactNode;
  format?: 'pdf' | 'csv';
};

export const UploadDocument: FC<UploadDocumentProps> = (props) => {
  return !props.documentKey ? (
    <UploadNewDocument {...props} />
  ) : (
    <KeepOrEditDocument {...{ ...props, documentKey: props.documentKey }} />
  );
};

const UploadNewDocument: FC<Omit<UploadDocumentProps, 'documentKey'>> = ({
  format = 'pdf',
  className,
  ...props
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };
  const [uploadedFileName, setUploadFileName] = useState('');

  return (
    <div className={`flex items-center relative top-[-0.5rem] ${className}`}>
      <input
        {...props}
        ref={hiddenFileInput}
        type="file"
        accept={`.${format}`}
        className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
        onChange={(e) => {
          const fileName = e.currentTarget.value.replace(/^.*[\\\/]/, '');
          setUploadFileName(fileName);
        }}
      />

      <div className="flex flex-col">
        <div className="truncate mr-5">
          {uploadedFileName ? uploadedFileName : 'Téléverser un document'}
        </div>
        <div>
          <span className="text-xs">Format accepté : {format}</span>
        </div>
      </div>

      <Button type="button" priority="secondary" onClick={browseForFile}>
        <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
        <span className="hidden md:inline-block text-sm">Parcourir</span>
      </Button>
    </div>
  );
};

const KeepOrEditDocument: FC<UploadDocumentProps & { documentKey: string }> = ({
  className,
  label,
  disabled,
  state,
  documentKey,
  format = 'pdf',
  ...props
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };
  const [uploadedFileName, setUploadFileName] = useState('');
  const [documentSelection, setDocumentSelection] = useState<
    'keep_existing_document' | 'edit_document'
  >(documentKey ? 'keep_existing_document' : 'edit_document');

  return (
    <RadioButtons
      className={className}
      legend={label}
      name={`${props.name}_document_selector`}
      disabled={disabled}
      options={[
        {
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
        },
        {
          label: (
            <div className={`flex items-center relative top-[-0.5rem]`}>
              {documentSelection === 'edit_document' && (
                <input
                  {...props}
                  ref={hiddenFileInput}
                  type="file"
                  accept={`.${format}`}
                  className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
                  onChange={(e) => {
                    const fileName = e.currentTarget.value.replace(/^.*[\\\/]/, '');
                    setUploadFileName(fileName);
                  }}
                />
              )}

              <div className="flex flex-col">
                <div className="truncate mr-5">
                  {uploadedFileName ? uploadedFileName : `Modifier le document existant`}
                </div>
                <div>
                  <span className="text-xs">Format accepté : {format}</span>
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
            checked: documentSelection === 'edit_document',
            onChange: () => setDocumentSelection('edit_document'),
            value: 'edit_document',
          },
        },
      ]}
      state={state}
      stateRelatedMessage={props.stateRelatedMessage}
    />
  );
};
