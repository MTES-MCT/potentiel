import { Option, isNone } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

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

export type RawIdentifiantDemandeAbandon = `abandon|${IdentifiantProjet.RawType}`;

export const estUnRawIdentifiantDemandeAbandon = (
  value: string,
): value is RawIdentifiantDemandeAbandon => {
  const [typeDemande, rawIdentifiantProjet] = value.split('|');

  return typeDemande === 'abandon' && IdentifiantProjet.estUnRawType(rawIdentifiantProjet);
};

const convertirRawIdentifiantDemandeAbandon = (
  rawIdentifiant: RawIdentifiantDemandeAbandon,
): IdentifiantDemandeAbandon => {
  const [typeDemande, rawIdentifiantProjet] = rawIdentifiant.split('|');
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    rawIdentifiantProjet as IdentifiantProjet.RawType,
  );

  return {
    typeDemande: typeDemande as 'abandon',
    ...identifiantProjet,
  };
};

export const convertirEnIdentifiantDemandeAbandon = (
  identifiantDemandeAbandon: RawIdentifiantDemandeAbandon,
): IdentifiantDemandeAbandonValueType => {
  return {
    ...convertirRawIdentifiantDemandeAbandon(identifiantDemandeAbandon),
    formatter() {
      return `abandon|${this.appelOffre}#${this.période}#${
        isNone(this.famille) ? '' : this.famille
      }#${this.numéroCRE}`;
    },
  };
};
