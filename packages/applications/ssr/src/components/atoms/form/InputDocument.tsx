import React, { FC } from 'react';
import { RadioButtonsProps } from '@codegouvfr/react-dsfr/RadioButtons';

import { UploadMultipleDocuments } from './UploadMultipleDocuments';
import { KeepOrEditDocument } from './KeepOrEditDocument';

export type InputDocumentProps = {
  className?: string;
  label: React.ReactNode;
  name: string;
  id?: string;
  documentKey?: string;
  required?: boolean;
  disabled?: boolean;
  state?: RadioButtonsProps['state'];
  stateRelatedMessage?: React.ReactNode;
  format?: 'pdf' | 'csv';
  hintText?: string;
  multiple?: true;
};

export const InputDocument: FC<InputDocumentProps> = (props) => {
  return !props.documentKey ? (
    <UploadMultipleDocuments {...props} />
  ) : (
    <KeepOrEditDocument {...props} documentKey={props.documentKey} />
  );
};
