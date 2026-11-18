import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { GetScopeProjetUtilisateur } from '../../index.js';
import type { GetNombreDeGarantiesFinancièresÀInstruirePort } from './port/getNombreDeGarantiesFinancièresÀInstruire.port.js';

type Volumétrie = {
  total: number;
  new: number;
};

export type ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel = {
  projetEnAttente: Pick<Volumétrie, 'total'>;
  dépôts: Volumétrie;
  demandeMainlevée: Volumétrie;
};

export type ConsulterNombreDeGarantiesFinancièresÀInstruireQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterNombreDeGarantiesFinancièresÀInstruire',
  {
    utilisateur: string;
  },
  ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel
>;

export type ConsulterNombreDeGarantiesFinancièresÀInstruireDependencies = {
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
  getNombreDeGarantiesFinancièresÀInstruire: GetNombreDeGarantiesFinancièresÀInstruirePort;
};

export const registerConsulterNombreDeGarantiesFinancièresÀInstruireQuery = ({
  getScopeProjetUtilisateur,
  getNombreDeGarantiesFinancièresÀInstruire,
}: ConsulterNombreDeGarantiesFinancièresÀInstruireDependencies) => {
  const handler: MessageHandler<ConsulterNombreDeGarantiesFinancièresÀInstruireQuery> = async ({
    utilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    if (!scope.régions?.length) {
      return {
        dépôts: {
          total: 0,
          new: 0,
        },
        projetEnAttente: {
          total: 0,
        },
        demandeMainlevée: {
          total: 0,
          new: 0,
        },
      };
    }

    const nombreDemandes = await getNombreDeGarantiesFinancièresÀInstruire(
      DateTime.now().retirerNombreDeMois(1).formatter(),
      scope.régions,
    );

    return nombreDemandes;
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterNombreDeGarantiesFinancièresÀInstruire',
    handler,
  );
};
