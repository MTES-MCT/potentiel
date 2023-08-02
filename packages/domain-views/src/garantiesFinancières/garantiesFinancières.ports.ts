import { Readable } from 'stream';

export type TéléchargerAttestationGarantiesFinancièresPort = (args: {
  type: 'attestation-constitution-garanties-Financieres';
  identifiantProjet: string;
  format: string;
}) => Promise<Readable | undefined>;
