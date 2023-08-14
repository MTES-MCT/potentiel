import { Readable } from 'stream';

export type TypeFichier =
  | 'depot-attestation-constitution-garanties-financieres'
  | 'attestation-constitution-garanties-financieres';

export type TéléverserFichierPort = (data: {
  type: TypeFichier;
  identifiantProjet: string;
  format: string;
  content: Readable;
}) => Promise<void>;
