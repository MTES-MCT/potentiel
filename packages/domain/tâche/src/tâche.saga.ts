import { Message, MessageHandler, mediator } from 'mediateur';

export type SubscriptionEvent = { type: string };

export type Execute = Message<'EXECUTE_TÂCHE_SAGA', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
    }
  };

  mediator.register('EXECUTE_TÂCHE_SAGA', handler);
};
