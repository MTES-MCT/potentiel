import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import {
  AjouterTâchePlanifiéeCommand,
  ExécuterTâchePlanifiéeUseCase,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';

import { sleep } from '../../../../../helpers/sleep';
import { PotentielWorld } from '../../../../../potentiel.world';
import { setDépôtData } from '../../dépôt/stepDefinitions/helper';

import { setGarantiesFinancièresData } from './helper';

EtantDonné(
  'des garanties financières actuelles pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: setDépôtData({
        identifiantProjet,
        typeGarantiesFinancières: exemple[
          'type'
        ] as GarantiesFinancières.TypeGarantiesFinancières.RawType,
        dateÉchéance: exemple[`date d'échéance`],
        format: exemple['format'],
        dateConstitution: exemple[`date de constitution`],
        contenuFichier: exemple['contenu fichier'],
        dateSoumission: exemple['date de soumission'],
        soumisPar: exemple['soumis par'],
      }),
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: setGarantiesFinancièresData({
        identifiantProjet,
        validéLe: exemple['date de validation'],
        validéPar: exemple['validé par'],
      }),
    });

    await sleep(100);
  },
);

EtantDonné(
  'des garanties financières actuelles pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: setDépôtData({
        identifiantProjet,
      }),
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: setGarantiesFinancièresData({
        identifiantProjet,
      }),
    });

    await sleep(100);
  },
);

EtantDonné(
  `des garanties financières actuelles importées avec l'attestation manquante pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
      data: setGarantiesFinancièresData({
        identifiantProjet,
        typeGarantiesFinancières: exemple['type'],
        dateÉchéance: exemple[`date d'échéance`],
      }),
    });

    await sleep(100);
  },
);

EtantDonné(
  `le type des garanties financières actuelles importé pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
      data: setGarantiesFinancièresData({
        identifiantProjet,
      }),
    });

    await sleep(100);
  },
);

EtantDonné(
  'des garanties financières actuelles échues pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const dateÉchéance = new Date(exemple[`date d'échéance`]);
    const typeGarantiesFinancières = 'avec-date-échéance';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: setDépôtData({
        identifiantProjet,
        typeGarantiesFinancières,
        dateÉchéance: dateÉchéance.toISOString(),
      }),
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: setGarantiesFinancièresData({
        identifiantProjet,
      }),
    });

    await sleep(100);

    const echuLeDate = new Date(dateÉchéance.getTime());
    const echuLeValue = new Date(echuLeDate.setDate(echuLeDate.getDate() + 1));

    await mediator.send<AjouterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
      data: {
        identifiantProjet,
        tâches: [
          {
            typeTâchePlanifiée:
              GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
            àExécuterLe: DateTime.convertirEnValueType(echuLeValue),
          },
        ],
      },
    });
    await sleep(100);

    await mediator.send<ExécuterTâchePlanifiéeUseCase>({
      type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        typeTâchePlanifiéeValue:
          GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
      },
    });
  },
);
