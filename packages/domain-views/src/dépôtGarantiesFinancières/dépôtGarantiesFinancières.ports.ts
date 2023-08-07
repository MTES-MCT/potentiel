import { Readable } from 'stream';

export type TéléchargerDépôtAttestationGarantiesFinancièresPort = (args: {
  type: 'dépôt-attestation-constitution-garanties-Financieres';
  identifiantProjet: string;
  format: string;
}) => Promise<Readable | undefined>;
