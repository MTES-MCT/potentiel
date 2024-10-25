import React, { FC, useState } from 'react';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';

export type KeepOrEditDocumentProps = UploadDocumentProps & { documentKey: string };

export const KeepOrEditDocument: FC<KeepOrEditDocumentProps> = ({
  className = '',
  label,
  disabled,
  state,
  stateRelatedMessage,
  documentKey,
  formats,
  onChange,
  ...props
}) => {
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
            <div>
              <div>Modifier le document existant</div>
              {documentSelection === 'edit_document' && (
                <UploadDocument {...props} label="" formats={formats} onChange={onChange} />
              )}
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
      stateRelatedMessage={stateRelatedMessage}
    />
  );
};
