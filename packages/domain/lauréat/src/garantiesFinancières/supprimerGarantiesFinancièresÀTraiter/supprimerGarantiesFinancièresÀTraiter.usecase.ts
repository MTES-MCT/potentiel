import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { SupprimerGarantiesFinancièresÀTraiterCommand } from './supprimerGarantiesFinancièresÀTraiter.command';
import { SupprimerDocumentProjetCommand } from '@potentiel-domain/document';
import { ConsulterGarantiesFinancièresQuery } from '..';
import { AucunesGarantiesFinancièresÀTraiter } from './aucunesGarantiesFinancièresÀTraiter.error';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';

export type SupprimerGarantiesFinancièresÀTraiterUseCase = Message<
  'SUPPRIMER_GARANTIES_FINANCIÈRES_À_TRAITER_USECASE',
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
      type: 'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
      data: { identifiantProjetValue },
    });

    if (!garantiesFinancièreActuelles) {
      throw new AucunesGarantiesFinancières();
    }

    if (!garantiesFinancièreActuelles.àTraiter) {
      throw new AucunesGarantiesFinancièresÀTraiter();
    }

    await mediator.send<SupprimerDocumentProjetCommand>({
      type: 'SUPPRIMER_DOCUMENT_PROJET_COMMAND',
      data: {
        documentKey: garantiesFinancièreActuelles.àTraiter?.attestation.formatter(),
      },
    });

    await mediator.send<SupprimerGarantiesFinancièresÀTraiterCommand>({
      type: 'SUPPRIMER_GARANTIES_FINANCIÈRES_À_TRAITER_COMMAND',
      data: {
        identifiantProjet,
        suppriméLe,
        suppriméPar,
      },
    });
  };
  mediator.register('SUPPRIMER_GARANTIES_FINANCIÈRES_À_TRAITER_USECASE', runner);
};
