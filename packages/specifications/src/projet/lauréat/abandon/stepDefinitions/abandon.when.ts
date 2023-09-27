import { DataTable, When as Quand } from '@cucumber/cucumber';
import {
  DomainUseCase,
  PiéceJustificativeAbandon,
  RéponseSignée,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

Quand(
  `un porteur demande l'abandon du projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const raisonAbandon = exemple[`La raison de l'abandon`] ?? `La raison de l'abandon`;
      const format =
        exemple[`Le format de la piéce justificative`] ?? `Le format de la piéce justificative`;
      const content =
        exemple[`Le contenu de la piéce justificative`] ?? `Le contenu de la piéce justificative`;

      const recandidature = exemple[`Recandidature`] === 'oui';
      this.lauréatWorld.abandonWorld.recandidature = recandidature;

      const dateAbandon = new Date();
      this.lauréatWorld.abandonWorld.dateAbandon = dateAbandon;

      const piéceJustificative: PiéceJustificativeAbandon = {
        format,
        content: convertStringToReadableStream(content),
      };

      this.lauréatWorld.abandonWorld.piéceJustificative = {
        format,
        content,
      };

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'DEMANDER_ABANDON_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          raison: raisonAbandon,
          piéceJustificative,
          recandidature,
          dateAbandon: convertirEnDateTime(dateAbandon),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un porteur demande l'abandon avec recandidature pour un projet qui n'existe pas`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'DEMANDER_ABANDON_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet({
            appelOffre: 'appelOffreInconnu',
            famille: 'familleInconnue',
            numéroCRE: 'numéroCREInconnu',
            période: 'périodeInconnue',
          }),
          raison: `La raison de l'abandon`,
          piéceJustificative: {
            format: `Le format de l'accusé de réception`,
            content: convertStringToReadableStream(`Le contenu de l'accusé de réception`),
          },
          recandidature: false,
          dateAbandon: convertirEnDateTime(new Date()),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur rejette l'abandon pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();
    const format = exemple['Le format de la réponse signée'] ?? 'Le format de la réponse signée';
    const content = exemple['Le contenu de la réponse signée'] ?? 'Le contenu de la réponse signée';

    const dateRejet = new Date();
    this.lauréatWorld.abandonWorld.dateAbandon = dateRejet;

    const réponseSignée: RéponseSignée = {
      format,
      content: convertStringToReadableStream(content),
    };

    this.lauréatWorld.abandonWorld.réponseSignée = {
      format,
      content,
    };

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    try {
      await mediator.send<DomainUseCase>({
        type: 'REJETER_ABANDON_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          réponseSignée,
          rejetéLe: convertirEnDateTime(dateRejet),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
