import React, { FC } from 'react';
import { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';

import { UploadDocument, UploadDocumentProps } from './UploadDocument';
import { KeepOrEditDocument, KeepOrEditDocumentProps } from './KeepOrEditDocument';

export type InputDocumentProps = UploadDocumentProps | KeepOrEditDocumentProps;

export const InputDocument: FC<InputDocumentProps> = (props) => {
  return !props.documentKey ? (
    <UploadDocument {...props} />
  ) : (
    <KeepOrEditDocument {...props} documentKey={props.documentKey} />
  );
};
