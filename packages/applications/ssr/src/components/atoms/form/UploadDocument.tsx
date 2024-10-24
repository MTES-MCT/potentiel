import React, { FC, useState } from 'react';
import RadioButtons, { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';
import Button from '@codegouvfr/react-dsfr/Button';
import clsx from 'clsx';
import Link from 'next/link';

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
  hintText?: string;
  onChange?: (fileNames: Array<string>) => void;
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
  onChange,
  ...props
}) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const browseForFile = () => {
    hiddenFileInput?.current?.click();
  };
  const [uploadedFileName, setUploadFileName] = useState('');

  return (
    <div className={`fr-input-group ${className}`}>
      <label className={clsx('fr-label', props.state === 'error' && 'text-theme-error')}>
        {label}
      </label>
      <div className="fr-hint-text">
        Format accepté : {format}, taille maximale acceptée : {DEFAULT_FILE_SIZE_LIMIT_IN_MB} Mo
      </div>
      {props.hintText && <div className="fr-hint-text">{props.hintText}</div>}

      <div className="flex items-center relative mt-3 gap-3">
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
            onChange && onChange([fileName]);
          }}
        />
        <Button className="!mt-0" type="button" priority="secondary" onClick={browseForFile}>
          <Icon id="fr-icon-folder-2-fill" className="md:mr-1" />
          <span className="hidden md:inline-block text-sm">Parcourir</span>
        </Button>
        <p
          className={clsx(
            'text-sm truncate m-0 p-0',
            props.state === 'error' && 'text-theme-error',
          )}
        >
          {uploadedFileName ? uploadedFileName : 'Aucun document sélectionné'}
        </p>
      </div>
      {props.stateRelatedMessage && (
        <UploadDocumentStateRelatedMessage
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
        />
      )}
    </div>
  );
};

const UploadDocumentStateRelatedMessage = ({
  state,
  stateRelatedMessage,
}: {
  state: UploadDocumentProps['state'];
  stateRelatedMessage: UploadDocumentProps['stateRelatedMessage'];
}) =>
  state === 'error' ? (
    <div className="flex flex-row gap-2 items-center mt-2">
      <Icon id="fr-icon-error-fill" className="text-theme-error" size="sm" />
      <p className="truncate p-0 text-theme-error text-xs">{stateRelatedMessage}</p>
    </div>
  ) : (
    <p className="text-sm truncate p-0 fr-hint-text">{stateRelatedMessage}</p>
  );

const KeepOrEditDocument: FC<UploadDocumentProps & { documentKey: string }> = ({
  className = '',
  label,
  disabled,
  state,
  documentKey,
  format = 'pdf',
  onChange,
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
                    onChange && onChange([fileName]);
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
