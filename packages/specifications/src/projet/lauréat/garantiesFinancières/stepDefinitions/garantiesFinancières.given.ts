import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { sleep } from '../../../../helpers/sleep';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

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

EtantDonné(
  'des garanties financières à traiter pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'] || 'Consignation';
    const dateÉchéance = exemple[`date d'échéance`] || undefined;
    const format = exemple['format'] || 'application/pdf';
    const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
    const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
    const dateSoumission = exemple['date de soumission'] || '2024-01-02';
    const soumisPar = exemple['soumis par'] || 'user@test.test';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreGarantiesFinancièresUseCase>({
      type: 'SOUMETTRE_GARANTIES_FINANCIÈRES_USECASE',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        typeValue: typeGarantiesFinancières,
        dateConstitutionValue: new Date(dateConstitution).toISOString(),
        soumisLeValue: new Date(dateSoumission).toISOString(),
        soumisParValue: soumisPar,
        attestationValue: { content: convertStringToReadableStream(contenuFichier), format },
        ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
      },
    });

    await sleep(500);
  },
);
