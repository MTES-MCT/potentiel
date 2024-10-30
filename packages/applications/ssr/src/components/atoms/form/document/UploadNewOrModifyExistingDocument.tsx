import React, { FC } from 'react';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';
import { KeepOrEditDocument, KeepOrEditDocumentProps } from './KeepOrEditDocument';

export type UploadNewOrModifyExistingDocumentProps = UploadDocumentProps | KeepOrEditDocumentProps;

export const UploadNewOrModifyExistingDocument: FC<UploadNewOrModifyExistingDocumentProps> = (
  props,
) =>
  isKeepOrEditDocumentProps(props) ? (
    <KeepOrEditDocument
      id={props.id}
      name={props.name}
      label={props.label}
      className={props.className}
      required={props.required}
      disabled={props.disabled}
      formats={props.formats}
      multiple={props.multiple}
      hintText={props.hintText}
      state={props.state}
      stateRelatedMessage={props.stateRelatedMessage}
      onChange={props.onChange}
      documentKeys={props.documentKeys}
    />
  ) : (
    <UploadDocument
      id={props.id}
      name={props.name}
      label={props.label}
      className={props.className}
      required={props.required}
      disabled={props.disabled}
      formats={props.formats}
      multiple={props.multiple}
      hintText={props.hintText}
      state={props.state}
      stateRelatedMessage={props.stateRelatedMessage}
      onChange={props.onChange}
    />
  );

const isKeepOrEditDocumentProps = (
  props: UploadDocumentProps | KeepOrEditDocumentProps,
): props is KeepOrEditDocumentProps =>
  'documentKeys' in props && Array.isArray(props.documentKeys) && props.documentKeys.length > 0;
