import {
  DemandeComplèteRaccordementTransmiseEvent,
  IdentifiantProjet,
  formatIdentifiantProjet,
  createRaccordementAggregateId,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';

export class RaccordementWorld {
  #dateQualification!: Date;

  get dateQualification(): Date {
    if (!this.#dateQualification) {
      throw new Error('dateQualification not initialized');
    }
    return this.#dateQualification;
  }

  set dateQualification(value: Date) {
    this.#dateQualification = value;
  }

  #accuséReception!: { format: string };

  get accuséReception(): { format: string } {
    if (!this.#accuséReception) {
      throw new Error('accuséReception not initialized');
    }
    return this.#accuséReception;
  }

  set accuséReception(value: { format: string }) {
    this.#accuséReception = value;
  }

  #référenceDossierRaccordement!: string;

  get référenceDossierRaccordement(): string {
    if (!this.#référenceDossierRaccordement) {
      throw new Error('référenceDossierRaccordement not initialized');
    }
    return this.#référenceDossierRaccordement;
  }

  set référenceDossierRaccordement(value: string) {
    this.#référenceDossierRaccordement = value;
  }

  #identifiantProjet: IdentifiantProjet;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  constructor() {
    this.#identifiantProjet = {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      numéroCRE: '23',
    };
  }

  async createDemandeComplèteRaccordement(codeEIC: string) {
    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(this.identifiantProjet),
        identifiantGestionnaireRéseau: codeEIC,
        dateQualification: new Date().toISOString(),
        référenceDossierRaccordement: 'UNE-REFERENCE-DCR',
      },
    };
    await publish(createRaccordementAggregateId(this.identifiantProjet), event);
    this.#référenceDossierRaccordement = 'UNE-REFERENCE-DCR';
  }
}
