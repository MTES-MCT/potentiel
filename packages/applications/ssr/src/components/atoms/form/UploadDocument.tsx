import React, { FC, useState } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import RadioButtons, { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';

import { Routes } from '@potentiel-applications/routes';

import { DEFAULT_FILE_SIZE_LIMIT_IN_MB } from '@/utils/zod/documentTypes';

import { Icon } from '../Icon';

export type UploadDocumentProps = {
  className?: string;
  label: React.ReactNode;
  name: string;
  /**
  Si utilisé dans un formulaire
  l'id ne doit pas comprendre d'accent
  */
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
    <KeepOrEditDocument {...props} documentKey={props.documentKey} />
  );
};

const extractFileName = (path: string) => path.replace(/^.*[\\/]/, '');

const UploadNewDocument: FC<Omit<UploadDocumentProps, 'documentKey'>> = ({
  label,
  format = 'pdf',
  className = '',
  ...props
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };
  const [uploadedFileName, setUploadFileName] = useState('');

  return (
    <div className={`fr-input-group ${className}`}>
      <label
        className={`fr-label ${props.state === 'error' ? 'text-dsfr-error-_425_625-default' : ''}`}
      >
        {label}
      </label>
      <div className="fr-hint-text">
        Format accepté : {format}, taille maximale acceptée : {DEFAULT_FILE_SIZE_LIMIT_IN_MB} Mo
      </div>

      <div className="flex items-center relative mt-3 gap-3">
        <input
          {...props}
          aria-required={props.required}
          ref={hiddenFileInput}
          type="file"
          accept={`.${format}`}
          className={`-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0`}
          onChange={(e) => {
            const fileName = extractFileName(e.currentTarget.value);
            setUploadFileName(fileName);
          }}
        />
        <Button className="!mt-0" type="button" priority="secondary" onClick={browseForFile}>
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>
        <p
          className={`text-sm truncate m-0 p-0 ${props.state === 'error' ? 'text-dsfr-error-_425_625-default' : ''}`}
        >
          {uploadedFileName ? uploadedFileName : 'Aucun document sélectionné'}
        </p>
      </div>
      <p
        className={`text-sm truncate m-0 p-0 ${props.state === 'error' ? 'text-dsfr-error-_425_625-default' : ''}`}
      >
        {props.stateRelatedMessage}
      </p>
    </div>
  );
};

const KeepOrEditDocument: FC<UploadDocumentProps & { documentKey: string }> = ({
  className = '',
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
              Conserver le document existant (
              <Link href={Routes.Document.télécharger(documentKey)} target="_blank">
                télécharger
              </Link>
              )
              {documentSelection === 'keep_existing_document' && (
                <input
                  {...props}
                  aria-required={props.required}
                  type="text"
                  hidden
                  value={documentKey}
                />
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
            <div className="relative top-[-0.5rem]">
              {documentSelection === 'edit_document' && (
                <input
                  {...props}
                  aria-required={props.required}
                  ref={hiddenFileInput}
                  type="file"
                  accept={`.${format}`}
                  className="-z-50 opacity-0 h-full absolute top-0 left-0 disabled:opacity-0"
                  onChange={(e) => {
                    const fileName = extractFileName(e.currentTarget.value);
                    setUploadFileName(fileName);
                  }}
                />
              )}

              <div className="flex flex-col">
                <div>Modifier le document existant</div>
                <div className="fr-hint-text">
                  Format accepté : {format}, taille maximale acceptée :{' '}
                  {DEFAULT_FILE_SIZE_LIMIT_IN_MB} Mo
                </div>

                <div className="flex items-center flex-row gap-2 mt-2">
                  <Button
                    type="button"
                    priority="secondary"
                    onClick={browseForFile}
                    disabled={documentSelection === 'keep_existing_document'}
                  >
                    <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
                    <span className="hidden md:inline-block text-sm">Parcourir</span>
                  </Button>

                  <p className="text-sm truncate m-0 p-0">
                    {uploadedFileName ? uploadedFileName : 'Aucun document sélectionné'}
                  </p>
                </div>
              </div>
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
