import { When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { convertStringToReadable } from '../helpers/convertStringToReadable';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  DossierRaccordementReadModel,
} from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { convertReadableToString } from '../helpers/convertReadableToString';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour le dossier de raccordement ayant pour référence {string} avec :`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateSignature = convertirEnDateTime(exemple['La date de signature']);
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadable(content),
    };

    this.raccordementWorld.dateSignature = dateSignature;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      format,
      content,
    };

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        data: {
          dateSignature,
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          propositionTechniqueEtFinancièreSignée,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const dossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      },
    });

    if (isNone(dossierRaccordement)) {
      throw new Error('Dossier de raccordement non trouvé');
    }

    const actualPtf = dossierRaccordement.propositionTechniqueEtFinancière || {};

    const expectedPtf: DossierRaccordementReadModel['propositionTechniqueEtFinancière'] = {
      dateSignature: this.raccordementWorld.dateSignature.formatter(),
      format: this.raccordementWorld.propositionTechniqueEtFinancièreSignée.format,
    };

    actualPtf.should.be.deep.equal(expectedPtf);

    const propositionTechniqueEtFinancièreSignée =
      await mediator.send<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>({
        type: 'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
        data: {
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
          identifiantProjet: this.projetWorld.identifiantProjet,
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
