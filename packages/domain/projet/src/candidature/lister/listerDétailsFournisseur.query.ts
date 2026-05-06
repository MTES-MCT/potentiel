import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity.js';
import { Candidature, GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import {
  Dépôt,
  DétailFournisseursCandidatureEntity,
  Localité,
  TypeActionnariat,
} from '../index.js';

export type DétailsFournisseurListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statutCandidature: Candidature.StatutCandidature.ValueType;
  région: Localité.ValueType['région'];
  sociétéMère: Dépôt.ValueType['sociétéMère'];
  typeActionnariat?: TypeActionnariat.ValueType;
  fournisseurs: DétailFournisseursCandidatureEntity['fournisseurs'];
};

export type ListerDétailsFournisseurReadModel = Readonly<{
  items: Array<DétailsFournisseurListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerDétailsFournisseurQuery = Message<
  'Candidature.Query.ListerDétailsFournisseur',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    periode?: string;
    famille?: string;
    typeActionnariat?: Array<TypeActionnariat.RawType>;
  },
  ListerDétailsFournisseurReadModel
>;

export type ListerDétailsFournisseurQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerDétailsFournisseurQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDétailsFournisseurQueryDependencies) => {
  const handler: MessageHandler<ListerDétailsFournisseurQuery> = async ({
    utilisateur,
    appelOffre,
    periode,
    famille,
    typeActionnariat,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<CandidatureEntity, DétailFournisseursCandidatureEntity>('candidature', {
      join: {
        entity: 'détail-fournisseurs-candidature',
        on: 'identifiantProjet',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        localité: {
          région: Where.matchAny(scope.régions),
        },
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        période: Where.equal(periode),
        famille: Where.equal(famille),
        actionnariat: Where.matchAny(
          Candidature.TypeActionnariat.getTypeActionnariaWhereConditionsForQuery(typeActionnariat),
        ),
        estNotifiée: Where.equal(true),
      },
      orderBy: {
        appelOffre: 'ascending',
        période: 'ascending',
        nomProjet: 'ascending',
      },
    });

    return {
      items: items.map(mapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Candidature.Query.ListerDétailsFournisseur', handler);
};

type MapToReadModel = (
  candidature: CandidatureEntity & Joined<DétailFournisseursCandidatureEntity>,
) => DétailsFournisseurListItemReadModel;

export const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  localité: { région },
  nomProjet,
  statut,
  sociétéMère,
  actionnariat,
  'détail-fournisseurs-candidature': { fournisseurs },
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  statutCandidature: Candidature.StatutCandidature.convertirEnValueType(statut),
  région,
  sociétéMère,
  typeActionnariat: actionnariat
    ? Candidature.TypeActionnariat.convertirEnValueType(actionnariat)
    : undefined,
  fournisseurs,
});
