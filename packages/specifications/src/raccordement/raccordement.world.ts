import {
  buildTransmettreDemandeComplèteRaccordementUseCase,
  buildTransmettrePropositionTechniqueEtFinancièreUseCase,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { Readable } from 'stream';

async function getReadableContent(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(chunk);
  }

  return chunks.join('');
}

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

  #accuséRéceptionDemandeComplèteRaccordement!: { format: string; content: Readable };

  get accuséRéceptionDemandeComplèteRaccordement(): { format: string; content: Readable } {
    if (!this.#accuséRéceptionDemandeComplèteRaccordement) {
      throw new Error('accuséRéceptionDemandeComplèteRaccordement not initialized');
    }
    return this.#accuséRéceptionDemandeComplèteRaccordement;
  }

  set accuséRéceptionDemandeComplèteRaccordement(value: { format: string; content: Readable }) {
    this.#accuséRéceptionDemandeComplèteRaccordement = value;
  }

  #propositionTechniqueEtFinancièreSignée!: {
    dateSignature: Date;
    format: string;
    content: Readable;
  };

  get propositionTechniqueEtFinancièreSignée(): {
    dateSignature: Date;
    format: string;
    content: Readable;
  } {
    if (!this.#propositionTechniqueEtFinancièreSignée) {
      throw new Error('fichierPropositionTechniqueEtFinancière not initialized');
    }
    return this.#propositionTechniqueEtFinancièreSignée;
  }

  set propositionTechniqueEtFinancièreSignée(value: {
    dateSignature: Date;
    format: string;
    content: Readable;
  }) {
    this.#propositionTechniqueEtFinancièreSignée = value;
  }

  #ancienneRéférenceDossierRaccordement!: string;

  get ancienneRéférenceDossierRaccordement(): string {
    if (!this.#ancienneRéférenceDossierRaccordement) {
      throw new Error('ancienneRéférenceDossierRaccordement not initialized');
    }
    return this.#ancienneRéférenceDossierRaccordement;
  }

  set ancienneRéférenceDossierRaccordement(value: string) {
    this.#ancienneRéférenceDossierRaccordement = value;
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

  #identifiantProjet: {
    appelOffre: string;
    période: string;
    numéroCRE: string;
  };

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  constructor() {
    this.#identifiantProjet = {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      numéroCRE: '23',
    };
    this.#accuséRéceptionDemandeComplèteRaccordement = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier DCR", {
        encoding: 'utf8',
      }),
    };
  }

  async createDemandeComplèteRaccordement(codeEIC: string) {
    const référenceDossierRaccordement = 'UNE-REFERENCE-DCR';
    const dateQualification = new Date();

    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementUseCase({
        référenceDossierRaccordement,
        nouvelAccuséRéception: this.accuséRéceptionDemandeComplèteRaccordement,
        identifiantGestionnaireRéseau: { codeEIC },
        identifiantProjet: this.identifiantProjet,
        dateQualification,
      }),
    );

    this.#référenceDossierRaccordement = référenceDossierRaccordement;
    this.#ancienneRéférenceDossierRaccordement = référenceDossierRaccordement;
    this.#dateQualification = dateQualification;
  }

  async createPropositionTechniqueEtFinancière() {
    const référenceDossierRaccordement = 'UNE-REFERENCE-DCR';
    const dateSignature = new Date();
    const ptf = {
      dateSignature: new Date(),
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier PTF", {
        encoding: 'utf8',
      }),
    };

    await mediator.send(
      buildTransmettrePropositionTechniqueEtFinancièreUseCase({
        référenceDossierRaccordement,
        nouvellePropositionTechniqueEtFinancière: ptf,
        identifiantProjet: this.identifiantProjet,
        dateSignature,
      }),
    );

    this.#référenceDossierRaccordement = référenceDossierRaccordement;
    this.propositionTechniqueEtFinancièreSignée = ptf;
  }
}
