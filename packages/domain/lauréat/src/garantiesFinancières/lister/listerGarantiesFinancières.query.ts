import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime, CommonPort, CommonError } from '@potentiel-domain/common';

import { TypeDocumentGarantiesFinancières, TypeGarantiesFinancières } from '..';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';
import { GarantiesFinancièresEntity } from '../garantiesFinancières.entity';
import { DocumentProjet } from '@potentiel-domain/document';

export type ListerGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancières',
  {
    statut: string;
    utilisateur: {
      rôle: string;
      email: string;
    };
    pagination: { page: number; itemsPerPage: number };
    appelOffre?: string;
  },
  ListerGarantiesFinancièresReadModel
>;

export type GarantiesFinancièresListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;

  dateDernièreMiseÀJour: DateTime.ValueType;

  validées?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    validéLe: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
  };
  àTraiter?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
  };
  enAttente?: { dateLimiteSoumission: DateTime.ValueType; demandéLe: DateTime.ValueType };
};

export type ListerGarantiesFinancièresReadModel = {
  items: ReadonlyArray<GarantiesFinancièresListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerGarantiesFinancièresPort = (args: {
  where: {
    statut: string;
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

export type ListerGarantiesFinancièresDependencies = {
  listerGarantiesFinancières: ListerGarantiesFinancièresPort;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerGarantiesFinancièresQuery = ({
  listerGarantiesFinancières: listerGarantiesFinancières,
  récupérerRégionDreal,
}: ListerGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerGarantiesFinancièresQuery> = async ({
    appelOffre,
    utilisateur,
    statut,
    pagination: { page, itemsPerPage },
  }) => {
    if (utilisateur.rôle === 'dreal') {
      const région = await récupérerRégionDreal(utilisateur.email);
      if (isNone(région)) {
        throw new CommonError.RégionNonTrouvéeError();
      }

      const result = await listerGarantiesFinancières({
        where: { statut, ...(appelOffre && { appelOffre }) },
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

    const result = await listerGarantiesFinancières({
      where: { statut, ...(appelOffre && { appelOffre }) },
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
  mediator.register('Lauréat.GarantiesFinancières.Query.ListerGarantiesFinancières', handler);
};

const mapToListItemReadModel = (
  entity: GarantiesFinancièresEntity,
): GarantiesFinancièresListItemReadModel => {
  const validées: GarantiesFinancièresListItemReadModel['validées'] = entity.validées && {
    type: TypeGarantiesFinancières.convertirEnValueType(entity.validées.type),
    ...(entity.validées.dateÉchéance && {
      dateÉchéance: DateTime.convertirEnValueType(entity.validées.dateÉchéance),
    }),
    dateConstitution: DateTime.convertirEnValueType(entity.validées.dateConstitution),
    validéLe: DateTime.convertirEnValueType(entity.validées.validéLe),
    attestation: DocumentProjet.convertirEnValueType(
      IdentifiantProjet.convertirEnValueType(entity.identifiantProjet).formatter(),
      TypeDocumentGarantiesFinancières.convertirEnGarantiesFinancièresSoumisesValueType.formatter(),
      DateTime.convertirEnValueType(entity.validées.validéLe).formatter(),
      entity.validées.attestation.format,
    ),
  };
  const àTraiter: GarantiesFinancièresListItemReadModel['àTraiter'] = entity.àTraiter && {
    type: TypeGarantiesFinancières.convertirEnValueType(entity.àTraiter.type),
    ...(entity.àTraiter.dateÉchéance && {
      dateÉchéance: DateTime.convertirEnValueType(entity.àTraiter.dateÉchéance),
    }),
    dateConstitution: DateTime.convertirEnValueType(entity.àTraiter.dateConstitution),
    soumisLe: DateTime.convertirEnValueType(entity.àTraiter.soumisLe),
    attestation: DocumentProjet.convertirEnValueType(
      IdentifiantProjet.convertirEnValueType(entity.identifiantProjet).formatter(),
      TypeDocumentGarantiesFinancières.convertirEnGarantiesFinancièresSoumisesValueType.formatter(),
      DateTime.convertirEnValueType(entity.àTraiter.soumisLe).formatter(),
      entity.àTraiter.attestation.format,
    ),
  };
  const enAttente: GarantiesFinancièresListItemReadModel['enAttente'] = entity.enAttente && {
    dateLimiteSoumission: DateTime.convertirEnValueType(entity.enAttente.dateLimiteSoumission),
    demandéLe: DateTime.convertirEnValueType(entity.enAttente.demandéLe),
  };
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    appelOffre: entity.appelOffre,
    période: entity.période,
    nomProjet: entity.nomProjet,
    dateDernièreMiseÀJour: DateTime.convertirEnValueType(entity.misÀJourLe),
    validées,
    àTraiter,
    enAttente,
  };
};
