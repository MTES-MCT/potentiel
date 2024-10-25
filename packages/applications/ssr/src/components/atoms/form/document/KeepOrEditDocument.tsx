import React, { FC, useState } from 'react';
import Link from 'next/link';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { Routes } from '@potentiel-applications/routes';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';

export type KeepOrEditDocumentProps = UploadDocumentProps &
  ({ multiple: true; documentKeys: Array<string> } | { multiple?: undefined; documentKey: string });

export const KeepOrEditDocument: FC<KeepOrEditDocumentProps> = ({
  className = '',
  label,
  disabled,
  state,
  stateRelatedMessage,
  formats,
  onChange,
  ...props
}) => {
  const hasManyDocuments = props.multiple && props.documentKeys.length > 1;
  const hasOnlyOneDocument =
    (!props.multiple && props.documentKey !== '') ||
    (props.multiple && props.documentKeys.length) === 1;
  const noExistingDocument = !hasManyDocuments && !hasOnlyOneDocument;

  const [documentSelection, setDocumentSelection] = useState<
    'keep_existing_document' | 'edit_document'
  >(noExistingDocument ? 'edit_document' : 'keep_existing_document');

  const documentKeysToKeep = props.multiple ? props.documentKeys.join(',') : props.documentKey;

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
              {hasManyDocuments ? (
                <KeepManyDocuments
                  showLink={documentSelection === 'keep_existing_document'}
                  name={props.name}
                  documentKeys={props.documentKeys}
                />
              ) : hasOnlyOneDocument ? (
                <KeepSingleDocument
                  documentKey={props.multiple ? props.documentKeys[0] : props.documentKey}
                />
              ) : (
                <>Aucun document à conserver</>
              )}

              {documentSelection === 'keep_existing_document' && (
                <input
                  {...props}
                  aria-required={props.required}
                  type="text"
                  hidden
                  value={documentKeysToKeep}
                />
              )}
            </div>
          ),
          nativeInputProps: {
            checked: documentSelection === 'keep_existing_document',
            onChange: () => setDocumentSelection('keep_existing_document'),
            value: 'keep_existing_document',
            disabled: noExistingDocument,
          },
        },
        {
          label: (
            <div>
              <div>
                {noExistingDocument ? 'Ajouter un document' : 'Modifier le document existant'}
              </div>
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

const KeepManyDocuments: FC<{ showLink: boolean; name: string; documentKeys: Array<string> }> = ({
  showLink,
  name,
  documentKeys,
}) => {
  const [modal] = useState(
    createModal({
      id: `form-modal-files-to-keep-${name}`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <div>
      <div>Conserver les {documentKeys.length} documents existants</div>
      {showLink && (
        <div>
          <Link href="#" onClick={() => modal.open()}>
            Voir les fichiers
          </Link>
          <modal.Component title="Fichiers à conserver">
            <ul className="flex flex-col mt-4 w-full">
              {documentKeys.map((documentKey) => (
                <li
                  key={documentKey}
                  className="flex flex-row text-sm items-center px-3 border-b-[1px] border-b-dsfr-border-default-grey-default"
                >
                  <div className="truncate">{documentKey}</div>

                  <Link
                    className="ml-auto"
                    href={Routes.Document.télécharger(documentKey)}
                    target="_blank"
                  >
                    télécharger
                  </Link>
                </li>
              ))}
            </ul>
          </modal.Component>
        </div>
      )}
    </div>
  );
};

const KeepSingleDocument: FC<{ documentKey: string }> = ({ documentKey }) => (
  <>
    Conserver le document existant (
    <Link href={Routes.Document.télécharger(documentKey)} target="_blank">
      télécharger
    </Link>
    )
  </>
);
