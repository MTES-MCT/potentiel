import { RawIdentifiantProjet, TypeFichier } from '@potentiel/domain';

export type TéléchargerFichierPort = (args: {
  type: TypeFichier;
  identifiantProjet: RawIdentifiantProjet;
  format: string;
}) => Promise<ReadableStream | undefined>;
