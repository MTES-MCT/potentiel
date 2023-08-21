import { DataTable, When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { convertStringToReadableStream } from '../helpers/convertStringToReadable';

Quand(
  `le porteur modifie la demande complète de raccordement ayant pour référence {string} avec :`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = convertirEnDateTime(exemple['La date de qualification']);
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateQualification,
          accuséRéception,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
