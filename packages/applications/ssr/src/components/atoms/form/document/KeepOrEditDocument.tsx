import React, { FC, useState } from 'react';
import Link from 'next/link';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { Routes } from '@potentiel-applications/routes';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';

export type KeepOrEditDocumentProps = UploadDocumentProps & { documentKeys: Array<string> };

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
  const hasManyDocuments = props.documentKeys.length > 1;
  const hasOnlyOneDocument = props.documentKeys.length === 1;
  const noExistingDocument = props.documentKeys.length === 0;

  const [documentSelection, setDocumentSelection] = useState<
    'keep_existing_document' | 'edit_document'
  >(noExistingDocument ? 'edit_document' : 'keep_existing_document');

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
                <KeepSingleDocument documentKey={props.documentKeys[0]} />
              ) : (
                <>Aucun document à conserver</>
              )}

              {documentSelection === 'keep_existing_document' &&
                props.documentKeys.map((documentKey) => (
                  <input
                    id={props.id}
                    key={documentKey}
                    required={props.required}
                    aria-required={props.required}
                    type="text"
                    hidden
                    value={documentKey}
                  />
                ))}
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
                <UploadDocument
                  id={props.id}
                  name={props.name}
                  required={props.required}
                  hintText={props.hintText}
                  multiple={props.multiple}
                  label=""
                  formats={formats}
                  onChange={onChange}
                />
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
