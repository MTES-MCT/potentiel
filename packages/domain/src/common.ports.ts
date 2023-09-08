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

export type SupprimerFichierPort = (data: {
  type: TypeFichier;
  identifiantProjet: RawIdentifiantProjet;
}) => Promise<void>;

export type EmailType = 'notifier-pp-gf-validé-notification';

export type EnvoyerEmailPort = (data: {
  type: EmailType;
  contexte: {
    identifiantProjet: RawIdentifiantProjet;
  };
  message: {
    objet: string;
    destinataires: { email: string; name: string }[];
  };
  variables: Record<string, string>;
}) => Promise<void>;
