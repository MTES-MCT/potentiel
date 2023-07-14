import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { convertStringToReadable } from '../../helpers/convertStringToReadable';

Quand(
  `un porteur de projet transmet une proposition technique et financière pour le dossier de raccordement ayant pour référence {string} du projet {string} avec :`,
  async function (
    this: PotentielWorld,
    référenceDossierRaccordement: string,
    nomProjet: string,
    table: DataTable,
  ) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const exemple = table.rowsHash();
    const dateSignature = convertirEnDateTime(exemple['La date de signature']);
    const format = exemple[`Le format de la proposition technique et financière`];
    const content = exemple[`Le contenu de proposition technique et financière`];

    const propositionTechniqueEtFinancièreSignée = {
      format,
      content: convertStringToReadable(content),
    };

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
        data: {
          dateSignature,
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          propositionTechniqueEtFinancièreSignée,
        },
      });

      this.raccordementWorld.propositionTechniqueEtFinancièreFixtures.set(
        référenceDossierRaccordement,
        {
          dateSignature: dateSignature.date,
          propositionTechniqueEtFinancièreSignée: {
            format,
            content,
          },
        },
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);
