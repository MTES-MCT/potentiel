import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import {
  AjouterTâchePlanifiéeCommand,
  TâchePlanifiéeExecutéeEvent,
} from '@potentiel-domain/tache-planifiee';

import { Lauréat } from '..';

import { ÉchoirGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.command';
import * as TypeTâchePlanifiéeGarantiesFinancières from './typeTâchePlanifiéeGarantiesFinancières.valueType';
import { TypeGarantiesFinancièresImportéEvent } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.behavior';
import { ImporterTypeGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.command';

export type SubscriptionEvent =
  | TâchePlanifiéeExecutéeEvent
  | TypeGarantiesFinancièresImportéEvent
  | Lauréat.LauréatNotifiéEvent;

export type Execute = Message<
  'System.Lauréat.GarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

    switch (type) {
      case 'TâchePlanifiéeExecutée-V1':
        if (
          TypeTâchePlanifiéeGarantiesFinancières.convertirEnValueType(
            payload.typeTâchePlanifiée,
          ).estÉchoir()
        ) {
          await mediator.send<ÉchoirGarantiesFinancièresCommand>({
            type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
            data: {
              identifiantProjet,
            },
          });
        }
        break;
      case 'TypeGarantiesFinancièresImporté-V1':
        if (payload.dateÉchéance) {
          const dateÉchéance = DateTime.convertirEnValueType(payload.dateÉchéance);
          await mediator.send<AjouterTâchePlanifiéeCommand>({
            type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
            data: {
              identifiantProjet,
              tâches: [
                {
                  typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
                  àExécuterLe: dateÉchéance.ajouterNombreDeJours(1),
                },
                {
                  typeTâchePlanifiée:
                    TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
                  àExécuterLe: dateÉchéance.retirerNombreDeMois(1),
                },
                {
                  typeTâchePlanifiée:
                    TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
                  àExécuterLe: dateÉchéance.retirerNombreDeMois(2),
                },
              ],
            },
          });
        }
        break;
      case 'LauréatNotifié-V1':
        await mediator.send<ImporterTypeGarantiesFinancièresCommand>({
          type: 'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
          data: {
            identifiantProjet,
          },
        });
        break;
    }
  };
  mediator.register('System.Lauréat.GarantiesFinancières.Saga.Execute', handler);
};
