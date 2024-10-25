import React, { FC } from 'react';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';
import { KeepOrEditDocument, KeepOrEditDocumentProps } from './KeepOrEditDocument';

export type InputDocumentProps = UploadDocumentProps | KeepOrEditDocumentProps;

export const InputDocument: FC<InputDocumentProps> = (props) => {
  return isKeepOrEditDocumentProps(props) ? (
    <KeepOrEditDocument {...props} documentKey={props.documentKey} />
  ) : (
    <UploadDocument {...props} />
  );
};

const isKeepOrEditDocumentProps = (
  props: UploadDocumentProps | KeepOrEditDocumentProps,
): props is KeepOrEditDocumentProps => Object.hasOwn(props, 'documentKey');
