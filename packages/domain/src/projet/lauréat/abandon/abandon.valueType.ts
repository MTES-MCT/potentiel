export type PiéceJustificativeAbandon = {
  format: string;
  content: ReadableStream;
};

export type AbandonRejetéRéponseSignée = {
  type: 'abandon-rejeté';
  format: string;
  content: ReadableStream;
};

export type AbandonAccordéRéponseSignée = {
  type: 'abandon-accordé';
  format: string;
  content: ReadableStream;
};

export type ConfirmationAbandonDemandéRéponseSignée = {
  type: 'abandon-à-confirmer';
  format: string;
  content: ReadableStream;
};

export type RéponseSignée =
  | AbandonRejetéRéponseSignée
  | AbandonAccordéRéponseSignée
  | ConfirmationAbandonDemandéRéponseSignée;

export type StatusAbandon = 'demandé' | 'rejeté' | 'à-confirmer' | 'confirmé' | 'accordé';
