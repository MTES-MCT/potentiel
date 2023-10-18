export type AbandonRejetéRéponseSignéeValueType = {
  type: 'abandon-rejeté';
  format: string;
  content: ReadableStream;
};

export type AbandonAccordéRéponseSignéeValueType = {
  type: 'abandon-accordé';
  format: string;
  content: ReadableStream;
};

export type ConfirmationAbandonDemandéRéponseSignéeValueType = {
  type: 'abandon-à-confirmer';
  format: string;
  content: ReadableStream;
};

export type RéponseSignéeValueType =
  | AbandonRejetéRéponseSignéeValueType
  | AbandonAccordéRéponseSignéeValueType
  | ConfirmationAbandonDemandéRéponseSignéeValueType;
