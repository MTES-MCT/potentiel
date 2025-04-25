import { mediator, Message, MessageHandler } from 'mediateur';

export type ConsulterABénéficiéDuDélaiCDC2022Port = (identifiantProjet: string) => Promise<boolean>;

export type ConsulterDélaiDependencies = {
  consulterABénéficiéDuDélaiCDC2022: ConsulterABénéficiéDuDélaiCDC2022Port;
};

export type ConsulterDélaiQuery = Message<
  'Lauréat.Délai.Query.ConsulterDélai',
  { identifiantProjet: string },
  { aBénéficiéDuDélaiCDC2022: boolean }
>;

// En attendant d'avoir une véritable entity pour représenter le délai, on récupère les infos via adapter
export const registerConsulterDélai = ({
  consulterABénéficiéDuDélaiCDC2022,
}: ConsulterDélaiDependencies) => {
  const handler: MessageHandler<ConsulterDélaiQuery> = async ({ identifiantProjet }) => {
    const aBénéficiéDuDélaiCDC2022 = await consulterABénéficiéDuDélaiCDC2022(identifiantProjet);
    return { aBénéficiéDuDélaiCDC2022 };
  };

  mediator.register('Lauréat.Délai.Query.ConsulterDélai', handler);
};
