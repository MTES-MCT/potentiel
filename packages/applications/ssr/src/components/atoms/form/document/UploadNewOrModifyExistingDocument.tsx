import React, { FC } from 'react';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';
import { KeepOrEditDocument, KeepOrEditDocumentProps } from './KeepOrEditDocument';

export type UploadNewOrModifyExistingDocumentProps = UploadDocumentProps | KeepOrEditDocumentProps;

export const UploadNewOrModifyExistingDocument: FC<UploadNewOrModifyExistingDocumentProps> = (
  props,
) => {
  return isKeepOrEditDocumentProps(props) ? (
    <KeepOrEditDocument {...props} documentKeys={props.documentKeys} />
  ) : (
    <UploadDocument {...props} />
  );
};

const isKeepOrEditDocumentProps = (
  props: UploadDocumentProps | KeepOrEditDocumentProps,
): props is KeepOrEditDocumentProps =>
  'documentKeys' in props && Array.isArray(props.documentKeys) && props.documentKeys.length > 0;
