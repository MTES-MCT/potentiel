import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { SupprimerGarantiesFinancièresÀTraiterCommand } from './supprimerGarantiesFinancièresÀTraiter.command';
import { SupprimerDocumentProjetCommand } from '@potentiel-domain/document';
import { ConsulterGarantiesFinancièresQuery } from '..';
import { AucunesGarantiesFinancièresÀTraiter } from './aucunesGarantiesFinancièresÀTraiter.error';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';

export type SupprimerGarantiesFinancièresÀTraiterUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancières',
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
      throw new AucunesGarantiesFinancièresÀTraiter();
    }

    await mediator.send<SupprimerDocumentProjetCommand>({
      type: 'Document.Query.SupprimerDocumentProjet',
      data: {
        documentKey: garantiesFinancièreActuelles.àTraiter?.attestation.formatter(),
      },
    });

    await mediator.send<SupprimerGarantiesFinancièresÀTraiterCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancières',
      data: {
        identifiantProjet,
        suppriméLe,
        suppriméPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancières', runner);
};
