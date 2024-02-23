import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { SupprimerGarantiesFinancièresÀTraiterCommand } from './supprimerGarantiesFinancièresÀTraiter.command';

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
    suppriméLeValue: soumisLeValue,
    suppriméParValue: soumisParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const suppriméLe = DateTime.convertirEnValueType(soumisLeValue);
    const suppriméPar = IdentifiantUtilisateur.convertirEnValueType(soumisParValue);

    // TO DO : supprimer document
    // await mediator.send<EnregistrerDocumentProjetCommand>({
    //   type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
    //   data: {
    //     content: attestationValue!.content,
    //     documentProjet: attestation,
    //   },
    // });

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
