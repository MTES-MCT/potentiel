import { DomainError } from '../../../core/domain';

export class CertificateFileIsMissingError extends DomainError {
  constructor() {
    super(
      `Vous avez choisi l'option uploader une attestation mais le fichier attestation est manquant.`,
    );
  }
}
