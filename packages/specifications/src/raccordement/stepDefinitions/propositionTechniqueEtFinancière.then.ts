import { Then as Alors } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PotentielWorld } from '../../potentiel.world';
import { mediator } from 'mediateur';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  DossierRaccordementReadModel,
} from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { convertReadableToString } from '../../helpers/convertReadableToString';

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement {string} du projet {string}`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const dossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet,
        référenceDossierRaccordement: référenceDossierRaccordement,
      },
    });

    if (isNone(dossierRaccordement)) {
      throw new Error('Dossier de raccordement non trouvé');
    }

    const actualPtf = dossierRaccordement.propositionTechniqueEtFinancière;

    const expectedPtf: DossierRaccordementReadModel['propositionTechniqueEtFinancière'] = {
      dateSignature: this.raccordementWorld.dateSignature.formatter(),
      propositionTechniqueEtFinancièreSignée: {
        format: this.raccordementWorld.propositionTechniqueEtFinancièreSignée.format,
      },
    };

    expect(actualPtf).to.be.deep.equal(expectedPtf);

    const propositionTechniqueEtFinancièreSignée =
      await mediator.send<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>({
        type: 'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
        data: {
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
          identifiantProjet,
        },
      });

    if (isNone(propositionTechniqueEtFinancièreSignée)) {
      throw new Error('Proposition technique et financière signée non trouvée');
    }

    const actualFormat = propositionTechniqueEtFinancièreSignée.format;
    const expectedFormat = this.raccordementWorld.propositionTechniqueEtFinancièreSignée.format;

    actualFormat.should.be.equal(expectedFormat);

    const actualContent = await convertReadableToString(
      propositionTechniqueEtFinancièreSignée.content,
    );
    const expectedContent = this.raccordementWorld.propositionTechniqueEtFinancièreSignée.content;

    actualContent.should.be.equal(expectedContent);
  },
);
