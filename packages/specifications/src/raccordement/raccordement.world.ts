import {
  DemandeComplèteRaccordementTransmiseEvent,
  IdentifiantProjet,
  formatIdentifiantProjet,
  createRaccordementAggregateId,
  AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
} from '@potentiel/domain';
import { publish } from '@potentiel/pg-event-sourcing';
import { Readable } from 'stream';

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

  #accuséRéception!: { format: string; content: Readable };

  get accuséRéception(): { format: string; content: Readable } {
    if (!this.#accuséRéception) {
      throw new Error('accuséRéception not initialized');
    }
    return this.#accuséRéception;
  }

  set accuséRéception(value: { format: string; content: Readable }) {
    this.#accuséRéception = value;
  }

  #fichierPropositionTechniqueEtFinancière!: { format: string; content: Readable };

  get fichierPropositionTechniqueEtFinancière(): { format: string; content: Readable } {
    if (!this.#fichierPropositionTechniqueEtFinancière) {
      throw new Error('fichierPropositionTechniqueEtFinancière not initialized');
    }
    return this.#fichierPropositionTechniqueEtFinancière;
  }

  set fichierPropositionTechniqueEtFinancière(value: { format: string; content: Readable }) {
    this.#fichierPropositionTechniqueEtFinancière = value;
  }

  #autreFichierPropositionTechniqueEtFinancière!: { format: string; content: Readable };

  get autreFichierPropositionTechniqueEtFinancière(): { format: string; content: Readable } {
    if (!this.#autreFichierPropositionTechniqueEtFinancière) {
      throw new Error('autreFichierPropositionTechniqueEtFinancière not initialized');
    }
    return this.#autreFichierPropositionTechniqueEtFinancière;
  }

  set autreFichierPropositionTechniqueEtFinancière(value: { format: string; content: Readable }) {
    this.#autreFichierPropositionTechniqueEtFinancière = value;
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
    this.#accuséRéception = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier", {
        encoding: 'utf8',
      }),
    };
    this.#fichierPropositionTechniqueEtFinancière = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier PTF", {
        encoding: 'utf8',
      }),
    };
    this.#autreFichierPropositionTechniqueEtFinancière = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un autre fichier PTF", {
        encoding: 'utf8',
      }),
    };
  }

  async createDemandeComplèteRaccordement(codeEIC: string) {
    const référenceDossierRaccordement = 'UNE-REFERENCE-DCR';
    const identifiantProjet = formatIdentifiantProjet(this.identifiantProjet);
    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise',
      payload: {
        identifiantProjet,
        identifiantGestionnaireRéseau: codeEIC,
        dateQualification: new Date().toISOString(),
        référenceDossierRaccordement,
      },
    };
    await publish(createRaccordementAggregateId(this.#identifiantProjet), event);
    this.#référenceDossierRaccordement = référenceDossierRaccordement;

    const accuséRéceptionTransmisEvent: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      payload: {
        identifiantProjet,
        référenceDossierRaccordement,
        format: this.#accuséRéception.format,
      },
    };

    await publish(
      createRaccordementAggregateId(this.#identifiantProjet),
      accuséRéceptionTransmisEvent,
    );
  }
}
