import { DomainError } from '@core/domain';

export class SuppressionGFValidéeImpossibleError extends DomainError {
  constructor() {
    super(
      `Vous ne pouvez pas retirer ces garanties financières car elles ont déjà été validées. 
      Pour plus d'informations vous pouvez contacter notre équipe.`,
    );
  }
}
