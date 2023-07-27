import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type ProjetReadModelKey = `projet|${RawIdentifiantProjet}`;

export type ProjetReadModel = ReadModel<
  'projet',
  {
    identifiantGestionnaire?: { codeEIC: string };
    garantiesFinancières?: {
      attestation?: { format: string; dateConstitution: string };
      type?: `avec date d'échéance` | 'consignation' | `6 mois après achèvement` | 'type inconnu';
      dateÉchéance?: string;
    };
  }
>;

export { ConsulterProjetReadModel } from './consulter/consulterProjet.query';
