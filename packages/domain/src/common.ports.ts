import { RawIdentifiantProjet } from './domain.valueType';

export type TypeFichier =
  | 'depot-attestation-constitution-garanties-financieres'
  | 'attestation-constitution-garanties-financieres';

export type TéléverserFichierPort = (data: {
  type: TypeFichier;
  identifiantProjet: RawIdentifiantProjet;
  format: string;
  content: ReadableStream;
}) => Promise<void>;

export type DéplacerFichierPort = (data: {
  identifiantProjet: RawIdentifiantProjet;
  typeFichierActuel: TypeFichier;
  nouveauType: TypeFichier;
}) => Promise<void>;
