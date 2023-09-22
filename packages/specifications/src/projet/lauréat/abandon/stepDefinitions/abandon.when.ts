import { DataTable, When as Quand } from '@cucumber/cucumber';
import {
  DomainUseCase,
  PiéceJustificativeAbandon,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

Quand(
  `un porteur demande un abandon avec recandidature pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const raisonAbandon = exemple[`La raison de l'abandon`] ?? `La raison de l'abandon`;
      const format =
        exemple[`Le format de l'accusé de réception`] ?? `Le format de l'accusé de réception`;
      const content =
        exemple[`Le contenu de l'accusé de réception`] ?? `Le contenu de l'accusé de réception`;

      const piéceJustificative: PiéceJustificativeAbandon = {
        format,
        content: convertStringToReadableStream(content),
      };

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'DEMANDER_ABANDON_AVEC_RECANDIDATURE_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          raisonAbandon,
          piéceJustificative,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
