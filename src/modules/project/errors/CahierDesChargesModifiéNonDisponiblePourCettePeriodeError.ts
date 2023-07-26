import { DomainError } from '@core/domain';

export class CahierDesChargesModifiéNonDisponiblePourCettePeriodeError extends DomainError {
  constructor(appelOffreId: string, periodeId: string) {
    super(
      `L'appel d'offre ${appelOffreId} ne permet pas aux projets de la période ${periodeId} de choisir ce cahier des charges modificatif`,
    );
  }
}
