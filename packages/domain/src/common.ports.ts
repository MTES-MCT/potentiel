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
