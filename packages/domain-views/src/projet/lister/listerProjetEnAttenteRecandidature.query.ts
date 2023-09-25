import { ProjetReadModel } from '../projet.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';
import { List, ListResult } from '@potentiel/core-domain-views';

export type ListerProjetEnAttenteRecandidatureQuery = Message<
  'LISTER_PROJET_EN_ATTENTE_RECANDIDATURE_QUERY',
  {},
  ListResult<ProjetReadModel>
>;

export type ListerProjetEnAttenteRecandidatureDependencies = {
  list: List;
};

export const registerListerProjetEnAttenteRecandidatureQuery = ({
  list,
}: ListerProjetEnAttenteRecandidatureDependencies) => {
  const handler: MessageHandler<ListerProjetEnAttenteRecandidatureQuery> = async () => {
    return await list<ProjetReadModel>({
      type: 'projet',
      where: {
        recandidature: true,
      },
    });
  };

  mediator.register('LISTER_PROJET_EN_ATTENTE_RECANDIDATURE_QUERY', handler);
};
