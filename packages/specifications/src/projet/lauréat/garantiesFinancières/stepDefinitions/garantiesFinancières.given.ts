import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { sleep } from '../../../../helpers/sleep';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

EtantDonné(
  `des garanties financières en attente pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const notifiéLe = exemple['date de notification'];
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.NotifierGarantiesFinancièresEnAttenteUseCase>({
      type: 'NOTIFIER_GARANTIES_FINANCIÈRES_EN_ATTENTE_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        notifiéLeValue: new Date(notifiéLe).toISOString(),
        dateLimiteSoumissionValue: new Date(dateLimiteSoumission).toISOString(),
      },
    });

    await sleep(500);
  },
);
