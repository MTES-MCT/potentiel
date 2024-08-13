import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  `des garanties financières en attente pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const notifiéLe = exemple['date de notification'];
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        demandéLeValue: new Date(notifiéLe).toISOString(),
        dateLimiteSoumissionValue: new Date(dateLimiteSoumission).toISOString(),
        motifValue: motif,
      },
    });
  },
);
