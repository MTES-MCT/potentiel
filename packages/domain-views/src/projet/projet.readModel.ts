import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type ProjetReadModelKey = `projet#${RawIdentifiantProjet}`;

export type ProjetReadModel = ReadModel<
  'projet',
  {
    identifiantGestionnaire?: { codeEIC: string };
  }
>;

export { ConsulterProjetReadModel } from './consulter/consulterProjet.query';
