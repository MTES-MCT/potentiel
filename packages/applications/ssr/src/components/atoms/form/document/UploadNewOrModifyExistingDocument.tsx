import React, { FC } from 'react';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';
import { KeepOrEditDocument, KeepOrEditDocumentProps } from './KeepOrEditDocument';

export type UploadNewOrModifyExistingDocumentProps = UploadDocumentProps | KeepOrEditDocumentProps;

export const UploadNewOrModifyExistingDocument: FC<UploadNewOrModifyExistingDocumentProps> = (
  props,
) => {
  return isKeepOrEditDocumentProps(props) && props.multiple ? (
    <KeepOrEditDocument {...props} documentKeys={props.documentKeys} />
  ) : isKeepOrEditDocumentProps(props) && !props.multiple ? (
    <KeepOrEditDocument {...props} documentKey={props.documentKey} />
  ) : (
    <UploadDocument {...props} />
  );
};

const isKeepOrEditDocumentProps = (
  props: UploadDocumentProps | KeepOrEditDocumentProps,
): props is KeepOrEditDocumentProps =>
  (Object.hasOwn(props, 'documentKey') &&
    (props as { documentKey?: string }).documentKey !== undefined) ||
  (Object.hasOwn(props, 'documentKeys') &&
    (props as { documentKeys?: Array<string> }).documentKeys !== undefined);
