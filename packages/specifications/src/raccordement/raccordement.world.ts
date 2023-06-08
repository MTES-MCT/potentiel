import {
  IdentifiantProjet,
  PropositionTechniqueEtFinancièreSignée,
  DomainUseCase,
  convertirEnRéférenceDossierRaccordement,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantGestionnaireRéseau,
} from '@potentiel/domain';
import { none } from '@potentiel/monads';
import { mediator } from 'mediateur';
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

  #dateSignature!: Date;

  get dateSignature(): Date {
    if (!this.#dateSignature) {
      throw new Error('dateSignature not initialized');
    }
    return this.#dateSignature;
  }

  set dateSignature(value: Date) {
    this.#dateSignature = value;
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

  #propositionTechniqueEtFinancièreSignée!: PropositionTechniqueEtFinancièreSignée;

  get propositionTechniqueEtFinancièreSignée(): PropositionTechniqueEtFinancièreSignée {
    if (!this.#propositionTechniqueEtFinancièreSignée) {
      throw new Error('fichierPropositionTechniqueEtFinancière not initialized');
    }
    return this.#propositionTechniqueEtFinancièreSignée;
  }

  set propositionTechniqueEtFinancièreSignée(value: PropositionTechniqueEtFinancièreSignée) {
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

  #identifiantProjet: IdentifiantProjet;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  constructor() {
    this.#identifiantProjet = {
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    };
    this.#accuséRéceptionDemandeComplèteRaccordement = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier DCR", {
        encoding: 'utf8',
      }),
    };
    (this.#dateSignature = new Date('2023-01-01')),
      (this.#propositionTechniqueEtFinancièreSignée = {
        format: 'application/pdf',
        content: Readable.from("Contenu d'un fichier PTF", {
          encoding: 'utf8',
        }),
      });
  }

  async createDemandeComplèteRaccordement(codeEIC: string, référenceDossierRaccordement: string) {
    const dateQualification = new Date();
    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        accuséRéception: this.accuséRéceptionDemandeComplèteRaccordement,
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        identifiantProjet: convertirEnIdentifiantProjet(this.identifiantProjet),
        dateQualification,
      },
    });

    this.#référenceDossierRaccordement = référenceDossierRaccordement;
    this.#ancienneRéférenceDossierRaccordement = référenceDossierRaccordement;
    this.#dateQualification = dateQualification;
  }

  async createPropositionTechniqueEtFinancière() {
    const référenceDossierRaccordement = 'XXX-RP-2021-999999';

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
      data: {
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        propositionTechniqueEtFinancièreSignée: {
          format: this.propositionTechniqueEtFinancièreSignée.format,
          content: this.propositionTechniqueEtFinancièreSignée.content,
        },
        identifiantProjet: convertirEnIdentifiantProjet(this.identifiantProjet),
        dateSignature: this.dateSignature,
      },
    });

    this.#référenceDossierRaccordement = référenceDossierRaccordement;
  }
}
