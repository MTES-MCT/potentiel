import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { IdentifiantProjet } from '../../..';
import { LauréatEntity } from '../..';
import { AchèvementEntity } from '../achèvement.entity';
import { CandidatureEntity } from '../../../candidature';
import { DossierRaccordementEntity, RaccordementEntity } from '../../raccordement';

type AchèvementEnAttente = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  referenceDossierRaccordement: string;
  dateDCR?: DateTime.ValueType;
  appelOffre: string;
  codePostalInstallation: string;
  période: string;
  prix: number;
  souhaitIndexationCoefficientK: boolean;
};

export type ListerAchèvementEnAttenteReadModel = {
  items: Array<AchèvementEnAttente>;
  range: RangeOptions;
  total: number;
};

export type ListerAchèvementEnAttenteQuery = Message<
  'Lauréat.Achèvement.Query.ListerAchèvementEnAttente',
  {
    appelOffreId?: string;
    periodeId?: string;
    range?: RangeOptions;
  },
  ListerAchèvementEnAttenteReadModel
>;

export type ListerAchèvementEnAttenteDependencies = {
  list: List;
};

type AchèvementEnAttenteJoins = [RaccordementEntity, CandidatureEntity, AchèvementEntity];

export const registerListerAchèvementEnAttenteQuery = ({
  list,
}: ListerAchèvementEnAttenteDependencies) => {
  const handler: MessageHandler<ListerAchèvementEnAttenteQuery> = async ({
    appelOffreId,
    periodeId,
    range,
  }) => {
    const {
      items: projets,
      range: { endPosition, startPosition },
      total: totalProjet,
    } = await list<LauréatEntity, AchèvementEnAttenteJoins>('lauréat', {
      where: {
        appelOffre: Where.equal(appelOffreId),
        période: Where.equal(periodeId),
      },
      join: [
        {
          entity: 'raccordement',
          on: 'identifiantProjet',
        },
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },
        {
          entity: 'achèvement',
          on: 'identifiantProjet',
          where: {
            estAchevé: Where.equal(false),
          },
        },
      ],
      range,
    });

    if (totalProjet === 0) {
      return {
        items: [],
        range: {
          endPosition: 0,
          startPosition: 0,
        },
        total: 0,
      };
    }

    const { items: dossiers } = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantProjet: Where.matchAny(
          projets.map(({ identifiantProjet }) => identifiantProjet),
        ),
      },
    });

    const items = projets
      .map((projet) => mapToReadModel(projet, [...dossiers]))
      .filter((item) => item !== undefined);

    return {
      items,
      range: {
        endPosition,
        startPosition,
      },
      total: totalProjet,
    };
  };

  mediator.register('Lauréat.Achèvement.Query.ListerAchèvementEnAttente', handler);
};

type MapToReadModelProps = (
  projet: LauréatEntity & Joined<AchèvementEnAttenteJoins>,
  dossiers: Array<DossierRaccordementEntity>,
) => AchèvementEnAttente | undefined;

export const mapToReadModel: MapToReadModelProps = (
  {
    identifiantProjet,
    candidature: {
      localité: { codePostal },
      prixReference,
      coefficientKChoisi,
    },
    raccordement: { identifiantGestionnaireRéseau },
  },
  dossiers,
) => {
  const dossier = dossiers.find(
    (d) =>
      d.identifiantProjet === identifiantProjet &&
      d.identifiantGestionnaireRéseau === identifiantGestionnaireRéseau,
  );

  if (!dossier) {
    return;
  }

  const idProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    identifiantProjet: idProjet,
    appelOffre: idProjet.appelOffre,
    période: idProjet.période,
    referenceDossierRaccordement: dossier.référence,
    dateDCR: dossier.demandeComplèteRaccordement?.dateQualification
      ? DateTime.convertirEnValueType(dossier.demandeComplèteRaccordement.dateQualification)
      : undefined,
    codePostalInstallation: codePostal,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    prix: prixReference,
    souhaitIndexationCoefficientK: !!coefficientKChoisi,
  };
};
