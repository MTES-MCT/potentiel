import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauProjection } from '../gestionnaireRéseau.projection';
import { Message, MessageHandler, mediator } from 'mediateur';
import { List } from '@potentiel-libraries/projection';

type GetionnaireRéseauListItemReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
};

export type ListerGestionnaireRéseauReadModel = {
  items: ReadonlyArray<GetionnaireRéseauListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerGestionnaireRéseauQuery = Message<
  'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
  {},
  ListerGestionnaireRéseauReadModel
>;

export type ListerGestionnaireRéseauQueryDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauQuery = ({
  list,
}: ListerGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<ListerGestionnaireRéseauQuery> = async () => {
    const { currentPage, items, itemsPerPage, totalItems } =
      await list<GestionnaireRéseauProjection>({
        type: 'gestionnaire-réseau',
        orderBy: { property: 'raisonSociale', ascending: true },
      });

    return {
      currentPage,
      itemsPerPage,
      totalItems,
      items: items.map((item) => mapToReadModel(item)),
    };
  };
  mediator.register('LISTER_GESTIONNAIRE_RÉSEAU_QUERY', handler);
};

const mapToReadModel = ({
  codeEIC,
  raisonSociale,
}: GestionnaireRéseauProjection): GetionnaireRéseauListItemReadModel => {
  return {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    raisonSociale,
  };
};
