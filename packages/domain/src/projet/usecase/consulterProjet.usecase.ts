import {
  ConsulterProjetQuery,
  buildConsulterProjetQuery,
} from '../query/consulter/consulterProjet.query';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { ProjetReadModel } from '../query/consulter/projet.readModel';

export type ConsulterProjetUseCase = Message<
  'CONSULTER_PROJET_USE_CASE',
  ConsulterProjetQuery['data'],
  ProjetReadModel
>;

export const registerConsulterProjetUseCase = () => {
  const runner: MessageHandler<ConsulterProjetUseCase> = async ({ identifiantProjet }) => {
    return await mediator.send(
      buildConsulterProjetQuery({
        identifiantProjet,
      }),
    );
  };
  mediator.register('CONSULTER_PROJET_USE_CASE', runner);
};

export const buildConsulterProjetUseCase = getMessageBuilder<ConsulterProjetUseCase>(
  'CONSULTER_PROJET_USE_CASE',
);
