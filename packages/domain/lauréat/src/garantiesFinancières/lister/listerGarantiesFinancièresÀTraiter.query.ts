import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '..';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';
import { GarantiesFinancièresEntity } from '../garantiesFinancières.projection';
import { DocumentProjet } from '@potentiel-domain/document';
import { RécupérerRégionDrealPort } from '../../abandon';
import { RégionNonTrouvéeError } from '../../abandon/régionNonTrouvée.error';

export type ListerGarantiesFinancièresÀTraiterQuery = Message<
  'LISTER_GARANTIES_FINANCIÈRES_À_TRAITER_QUERY',
  {
    utilisateur: {
      rôle: string;
      email: string;
    };
    pagination: { page: number; itemsPerPage: number };
    appelOffre?: string;
  },
  ListerGarantiesFinancièresÀTraiterReadModel
>;

export type GarantiesFinancièresÀTraiterListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;

  statut: string;
  dernièreMiseÀJour: DateTime.ValueType;

  validées?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    validéLe: DateTime.ValueType;
    //attestation: DocumentProjet.ValueType;
  };
  àTraiter?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
  };
  enAttente?: { dateLimiteSoumission: DateTime.ValueType; notifiéLe: DateTime.ValueType };
};

export type ListerGarantiesFinancièresÀTraiterReadModel = {
  items: ReadonlyArray<GarantiesFinancièresÀTraiterListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerGarantiesFinancièresÀTraiterPort = (args: {
  where: {
    statut: 'à-traiter';
    appelOffre?: string;
  };
  région?: string;
  pagination: {
    page: number;
    itemsPerPage: number;
  };
}) => Promise<{
  items: ReadonlyArray<GarantiesFinancièresEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type ListerGarantiesFinancièresÀTraiterDependencies = {
  listerGarantiesFinancièresÀTraiter: ListerGarantiesFinancièresÀTraiterPort;
  récupérerRégionDreal: RécupérerRégionDrealPort;
};

export const registerListerGarantiesFinancièresÀTraiterQuery = ({
  listerGarantiesFinancièresÀTraiter,
  récupérerRégionDreal,
}: ListerGarantiesFinancièresÀTraiterDependencies) => {
  const handler: MessageHandler<ListerGarantiesFinancièresÀTraiterQuery> = async ({
    appelOffre,
    utilisateur,
    pagination: { page, itemsPerPage },
  }) => {
    if (utilisateur.rôle === 'dreal') {
      const région = await récupérerRégionDreal(utilisateur.email);
      if (isNone(région)) {
        throw new RégionNonTrouvéeError();
      }

      const result = await listerGarantiesFinancièresÀTraiter({
        where: { statut: 'à-traiter', appelOffre },
        région: région.région,
        pagination: { itemsPerPage, page },
      });
      if (isNone(result)) {
        throw new AucunesGarantiesFinancières();
      }
      return {
        ...result,
        items: result.items.map((item) => mapToListItemReadModel(item)),
      };
    }

    const result = await listerGarantiesFinancièresÀTraiter({
      where: { statut: 'à-traiter', appelOffre },
      pagination: { itemsPerPage, page },
    });
    if (isNone(result)) {
      throw new AucunesGarantiesFinancières();
    }
    return {
      ...result,
      items: result.items.map((item) => mapToListItemReadModel(item)),
    };
  };
  mediator.register('LISTER_GARANTIES_FINANCIÈRES_À_TRAITER_QUERY', handler);
};

const mapToListItemReadModel = (
  entity: GarantiesFinancièresEntity,
): GarantiesFinancièresÀTraiterListItemReadModel => {
  const validées: GarantiesFinancièresÀTraiterListItemReadModel['validées'] = entity.validées
    ? {
        type: TypeGarantiesFinancières.convertirEnValueType(entity.validées.type),
        dateÉchéance: entity.validées.dateÉchéance
          ? DateTime.convertirEnValueType(entity.validées.dateÉchéance)
          : undefined,
        dateConstitution: DateTime.convertirEnValueType(entity.validées.dateConstitution),
        validéLe: DateTime.convertirEnValueType(entity.validées.validéLe),
      }
    : undefined;
  const àTraiter: GarantiesFinancièresÀTraiterListItemReadModel['àTraiter'] = entity.àTraiter
    ? {
        type: TypeGarantiesFinancières.convertirEnValueType(entity.àTraiter.type),
        dateÉchéance: entity.àTraiter.dateÉchéance
          ? DateTime.convertirEnValueType(entity.àTraiter.dateÉchéance)
          : undefined,
        dateConstitution: DateTime.convertirEnValueType(entity.àTraiter.dateConstitution),
        soumisLe: DateTime.convertirEnValueType(entity.àTraiter.soumisLe),
        attestation: DocumentProjet.convertirEnValueType(
          IdentifiantProjet.convertirEnValueType(entity.identifiantProjet).formatter(),
          TypeDocumentGarantiesFinancières.garantiesFinancièresÀTraiter.formatter(),
          DateTime.convertirEnValueType(entity.àTraiter.soumisLe).formatter(),
          entity.àTraiter.attestation.format,
        ),
      }
    : undefined;
  const enAttente: GarantiesFinancièresÀTraiterListItemReadModel['enAttente'] = entity.enAttente
    ? {
        dateLimiteSoumission: DateTime.convertirEnValueType(entity.enAttente.dateLimiteSoumission),
        notifiéLe: DateTime.convertirEnValueType(entity.enAttente.notifiéLe),
      }
    : undefined;

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    appelOffre: entity.appelOffre,
    période: entity.période,
    nomProjet: entity.nomProjet,
    statut: entity.statut,
    dernièreMiseÀJour: DateTime.convertirEnValueType(entity.misÀJourLe),
    validées,
    àTraiter,
    enAttente,
  };
};
