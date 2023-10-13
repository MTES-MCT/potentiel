import { Option, isNone } from '@potentiel/monads';
import {
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
} from '../../projet.valueType';

export type PièceJustificativeAbandon = {
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

export type StatutAbandon =
  | 'demandé'
  | 'rejeté'
  | 'confirmation-demandée'
  | 'confirmé'
  | 'accordé'
  | 'annulé';

export type IdentifiantDemandeAbandon = {
  typeDemande: 'abandon';
  appelOffre: string;
  période: string;
  famille: Option<string>;
  numéroCRE: string;
};

export type IdentifiantDemandeAbandonValueType = IdentifiantDemandeAbandon & {
  formatter(): RawIdentifiantDemandeAbandon;
};

export type RawIdentifiantDemandeAbandon = `abandon|${RawIdentifiantProjet}`;

export const estUnRawIdentifiantDemandeAbandon = (
  value: string,
): value is RawIdentifiantDemandeAbandon => {
  const [typeDemande, rawIdentifiantProjet] = value.split('|');

  return typeDemande === 'abandon' && estUnRawIdentifiantProjet(rawIdentifiantProjet);
};

const convertirRawIdentifiantDemandeAbandon = (
  rawIdentifiant: RawIdentifiantDemandeAbandon,
): IdentifiantDemandeAbandon => {
  const [typeDemande, rawIdentifiantProjet] = rawIdentifiant.split('|');
  const identifiantProjet = convertirEnIdentifiantProjet(
    rawIdentifiantProjet as RawIdentifiantProjet,
  );

  return {
    typeDemande: typeDemande as 'abandon',
    ...identifiantProjet,
  };
};

export const convertirEnIdentifiantDemandeAbandon = (
  identifiantDemandeAbandon: RawIdentifiantDemandeAbandon,
): IdentifiantDemandeAbandonValueType => {
  // TODO: ajout validation
  return {
    ...convertirRawIdentifiantDemandeAbandon(identifiantDemandeAbandon),
    formatter() {
      return `abandon|${this.appelOffre}#${this.période}#${
        isNone(this.famille) ? '' : this.famille
      }#${this.numéroCRE}`;
    },
  };
};
