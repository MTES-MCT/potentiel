import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { ConsulterPropositionTechniqueEtFinancièreSignéeQuery } from '@potentiel/domain-views';

Quand(
  `le porteur de projet transmet une proposition technique et financière`,
  async function (this: PotentielWorld) {
    const dateSignature = new Date('2021-04-28');
    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
      data: {
        dateSignature,
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          this.raccordementWorld.référenceDossierRaccordement,
        ),
        identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
        propositionTechniqueEtFinancièreSignée:
          this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
      },
    });

    this.raccordementWorld.dateSignature = dateSignature;
  },
);

Alors(
  `la proposition technique et financière signée devrait être consultable dans le raccordement`,
  async function (this: PotentielWorld) {
    const ptf = await mediator.send<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>({
      type: 'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
      data: {
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      },
    });

    ptf.should.to.be.deep.equal(this.raccordementWorld.propositionTechniqueEtFinancièreSignée);
  },
);

Quand(
  `un administrateur transmet une proposition technique et financière pour un projet n'ayant aucun dossier de raccordement`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        data: {
          dateSignature: new Date(),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('dossier-inconnu'),
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          propositionTechniqueEtFinancièreSignée:
            this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un administrateur transmet une proposition technique et financière pour un dossier de raccordement non référencé`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        data: {
          dateSignature: new Date(),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('dossier-inconnu'),
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          propositionTechniqueEtFinancièreSignée:
            this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
