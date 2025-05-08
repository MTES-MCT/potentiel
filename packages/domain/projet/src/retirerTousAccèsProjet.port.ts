import { IdentifiantProjet } from '.';

export type RetirerTousAccèsProjet = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<void>;
