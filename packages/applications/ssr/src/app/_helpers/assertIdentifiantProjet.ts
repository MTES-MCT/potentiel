import { IdentifiantProjet } from '@potentiel-domain/projet';

export function assertIdentifiantProjet(value: string): asserts value is IdentifiantProjet.RawType {
  IdentifiantProjet.convertirEnValueType(value);
}
