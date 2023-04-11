import {
  DemandeComplèteRaccordementTransmiseEvent,
  GestionnaireRéseauReadModel,
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

  #référenceDemandeRaccordement!: string;

  get référenceDemandeRaccordement(): string {
    if (!this.#référenceDemandeRaccordement) {
      throw new Error('référenceDemandeRaccordement not initialized');
    }
    return this.#référenceDemandeRaccordement;
  }

  set référenceDemandeRaccordement(value: string) {
    this.#référenceDemandeRaccordement = value;
  }

  #identifiantProjet: IdentifiantProjet;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #enedis: GestionnaireRéseauReadModel;

  get enedis() {
    return this.#enedis;
  }

  constructor() {
    this.#identifiantProjet = {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      numéroCRE: '23',
    };

    this.#enedis = {
      codeEIC: '17X100A100A0001A',
      raisonSociale: 'Enedis',
      type: 'gestionnaire-réseau',
      aideSaisieRéférenceDossierRaccordement: {
        format: '',
        légende: '',
      },
    };
  }

  async createDemandeComplèteRaccordement() {
    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet: formatIdentifiantProjet(this.identifiantProjet),
        identifiantGestionnaireRéseau: this.enedis.codeEIC,
        dateQualification: new Date().toISOString(),
        référenceDemandeRaccordement: 'UNE-REFERENCE-DCR',
      },
    };
    await publish(createRaccordementAggregateId(this.identifiantProjet), event);
    this.#référenceDemandeRaccordement = 'UNE-REFERENCE-DCR';
  }
}
