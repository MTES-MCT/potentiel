import { Readable } from 'stream';

export type TéléverserFichierAttestationGarantiesFinancièresPort = (data: {
  type: 'attestation-constitution-garanties-Financieres';
  identifiantProjet: string;
  attestationConstitution: { format: string; content: Readable };
}) => Promise<void>;
