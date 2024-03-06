import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { SupprimerDépôtGarantiesFinancièresEnCoursCommand } from './supprimerDépôtGarantiesFinancièresEnCours.command';
import { ConsulterGarantiesFinancièresQuery } from '..';
import { AucunDépôtDeGarantiesFinancièresEnCours } from '../aucunDépôtDeGarantiesFinancièresEnCours.error';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';

export type SupprimerGarantiesFinancièresÀTraiterUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
  {
    identifiantProjetValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
  }
>;

export const registerSupprimerGarantiesFinancièresÀTraiterUseCase = () => {
  const runner: MessageHandler<SupprimerGarantiesFinancièresÀTraiterUseCase> = async ({
    identifiantProjetValue,
    suppriméLeValue,
    suppriméParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar = IdentifiantUtilisateur.convertirEnValueType(suppriméParValue);

    const garantiesFinancièreActuelles = await mediator.send<ConsulterGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
      data: { identifiantProjetValue },
    });

    if (!garantiesFinancièreActuelles) {
      throw new AucunesGarantiesFinancières();
    }

    if (!garantiesFinancièreActuelles.àTraiter) {
      throw new AucunDépôtDeGarantiesFinancièresEnCours();
    }

    await mediator.send<SupprimerDépôtGarantiesFinancièresEnCoursCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjet,
        suppriméLe,
        suppriméPar,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
    runner,
  );
};
