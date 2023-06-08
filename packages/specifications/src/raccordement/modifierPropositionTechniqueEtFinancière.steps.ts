import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';

import { mediator } from 'mediateur';
import { Readable } from 'stream';
import {
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';

Quand(
  `le porteur modifie la proposition technique et financière`,
  async function (this: PotentielWorld) {
    const dateSignature = new Date('2023-04-26');
    const propositionTechniqueEtFinancièreSignée = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un autre fichier PTF", {
        encoding: 'utf8',
      }),
    };

    await mediator.send<DomainUseCase>({
      type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          this.raccordementWorld.référenceDossierRaccordement,
        ),
        dateSignature,
        propositionTechniqueEtFinancièreSignée: propositionTechniqueEtFinancièreSignée,
      },
    });

    this.raccordementWorld.dateSignature = dateSignature;
  },
);

Quand(
  `le porteur modifie la date de signature de la proposition technique et financière`,
  async function (this: PotentielWorld) {
    const nouvelledateSignature = new Date('2023-04-01');

    await mediator.send<DomainUseCase>({
      type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          this.raccordementWorld.référenceDossierRaccordement,
        ),
        dateSignature: new Date(nouvelledateSignature),
        propositionTechniqueEtFinancièreSignée: {
          format: 'application/pdf',
          content: Readable.from("Contenu d'un fichier PTF", {
            encoding: 'utf8',
          }),
        },
      },
    });

    this.raccordementWorld.dateSignature = nouvelledateSignature;

    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      ...this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier PTF", {
        encoding: 'utf8',
      }),
    };
  },
);

Quand(
  `un administrateur modifie la date de signature pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('dossier-inconnu'),
          dateSignature: new Date('2023-04-26'),
          propositionTechniqueEtFinancièreSignée: {
            format: 'application/pdf',
            content: Readable.from("Contenu d'un fichier PTF", {
              encoding: 'utf8',
            }),
          },
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
