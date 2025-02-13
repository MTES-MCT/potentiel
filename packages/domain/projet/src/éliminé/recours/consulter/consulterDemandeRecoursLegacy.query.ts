import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../..';

/** @deprecated */
export type ConsulterDemandeRecoursLegacyReadModel = {
  filename: string;
};

/** @deprecated Utiliser Éliminé.Recours.Query.ConsulterRecours une fois les données migrées */
export type ConsulterDemandeRecoursLegacyQuery = Message<
  'Éliminé.Recours.Query.ConsulterDemandeRecoursLegacy',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterDemandeRecoursLegacyReadModel>
>;

/** @deprecated */
export type ConsulterDemandeRecoursLegacyDependencies = {
  consulterRecoursAdapter: (
    identifiantProjet: IdentifiantProjet.ValueType,
  ) => Promise<Option.Type<string>>;
};

/** @deprecated */
export const registerConsulterDemandeRecoursLegacyQuery = ({
  consulterRecoursAdapter,
}: ConsulterDemandeRecoursLegacyDependencies) => {
  const handler: MessageHandler<ConsulterDemandeRecoursLegacyQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await consulterRecoursAdapter(identifiantProjet);

    return Option.match(result)
      .some((filename) => ({ filename }))
      .none();
  };
  mediator.register('Éliminé.Recours.Query.ConsulterDemandeRecoursLegacy', handler);
};
