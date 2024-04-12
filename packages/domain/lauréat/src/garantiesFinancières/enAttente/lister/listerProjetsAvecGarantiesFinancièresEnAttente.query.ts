import { CommonError, CommonPort, DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Message, MessageHandler, mediator } from 'mediateur';
import {
  MotifDemandeGarantiesFinancières,
  ProjetAvecGarantiesFinancièresEnAttenteEntity,
} from '../..';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-librairies/monads';
import { List } from '@potentiel-domain/core';

type ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  régionProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  motif: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
  };
};

export type ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel = {
  items: ReadonlyArray<ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerProjetsAvecGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
  {
    appelOffre?: string;
    utilisateur: {
      rôle: string;
      email: string;
    };
    pagination: { page: number; itemsPerPage: number };
  },
  ListerProjetsAvecGarantiesFinancièresEnAttenteReadModel
>;

export type ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies = {
  list: List;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery = ({
  list,
  récupérerRégionDreal,
}: ListerProjetsAvecGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ListerProjetsAvecGarantiesFinancièresEnAttenteQuery> = async ({
    appelOffre,
    utilisateur: { email, rôle },
    pagination,
  }) => {
    let région: string | undefined = undefined;

    /**
     * @todo on devrait passer uniquement la région dans la query et pas les infos utilisateur pour le déterminer
     */
    if (rôle === Role.dreal.nom) {
      const régionDreal = await récupérerRégionDreal(email);
      if (Option.isNone(régionDreal)) {
        throw new CommonError.RégionNonTrouvéeError();
      }

      région = régionDreal.région;
    }

    const where = {
      ...(appelOffre && { appelOffre }),
      ...(région && { régionProjet: région }),
    };

    const result = await list<ProjetAvecGarantiesFinancièresEnAttenteEntity>({
      type: 'projet-avec-garanties-financieres-en-attente',
      where,
      pagination,
    });

    return {
      ...result,
      items: result.items.map((item) => mapToReadModel(item)),
    };
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ListerProjetsAvecGarantiesFinancièresEnAttente',
    handler,
  );
};

const mapToReadModel = ({
  nomProjet,
  appelOffre,
  identifiantProjet,
  période,
  régionProjet,
  famille,
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour: { date },
}: ProjetAvecGarantiesFinancièresEnAttenteEntity): ProjetAvecGarantiesFinancièresEnAttenteListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  appelOffre,
  période,
  famille,
  régionProjet,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(date),
  },
});
