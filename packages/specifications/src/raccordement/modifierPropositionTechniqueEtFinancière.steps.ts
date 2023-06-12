import { DataTable, Given as EtantDonné, When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { convertStringToReadable } from '../helpers/convertStringToReadable';

EtantDonné(
  'une propositon technique et financière pour le dossier de raccordement ayant pour référence {string} avec :',
  async function (this: PotentielWorld, référenceDossierRaccordement: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateSignature = new Date(exemple['La date de signature']);
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadable(content),
    };

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateSignature,
        propositionTechniqueEtFinancièreSignée,
      },
    });
  },
);

Quand(
  `le porteur modifie la proposition technique et financière pour le dossier de raccordement ayant pour référence {string} avec :`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateSignature = new Date(exemple['La date de signature']);
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadable(content),
    };

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        data: {
          dateSignature,
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          propositionTechniqueEtFinancièreSignée,
        },
      });

      this.raccordementWorld.dateSignature = dateSignature;
      this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
      this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
        format,
        content,
      };
    } catch (e) {
      this.error = e as Error;
    }
  },
);
