import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { LauréatEntity } from '../..';
import { CandidatureEntity } from '../../../candidature';
import { DossierRaccordementEntity, RaccordementEntity } from '../../raccordement';
import { AchèvementEntity } from '../achèvement.entity';

type ProjetAvecAchevementATransmettre = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireReseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  referenceDossierRaccordement: string;
  dateDCR?: DateTime.ValueType;
  appelOffre: string;
  periode: string;
  codePostal: string;
  prix: number;
  coefficientKChoisi: boolean;
};

export type ListerProjetAvecAchevementATransmettreReadModel = {
  items: Array<ProjetAvecAchevementATransmettre>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetAvecAchevementATransmettreQuery = Message<
  'Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre',
  {
    appelOffre?: string;
    periode?: string;
    range?: RangeOptions;
    identifiantUtilisateur: Email.RawType;
  },
  ListerProjetAvecAchevementATransmettreReadModel
>;

export type ListerProjetAvecAchevementATransmettreDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

type ProjetAvecAchevementATransmettreJoins = [
  RaccordementEntity,
  CandidatureEntity,
  AchèvementEntity,
];
export const registerListerProjetAvecAchevementATransmettreQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerProjetAvecAchevementATransmettreDependencies) => {
  const handler: MessageHandler<ListerProjetAvecAchevementATransmettreQuery> = async ({
    appelOffre,
    periode,
    range,
    identifiantUtilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );

    const {
      items: projets,
      range: { endPosition, startPosition },
      total: totalProjet,
    } = await list<LauréatEntity, ProjetAvecAchevementATransmettreJoins>('lauréat', {
      where: {
        appelOffre: Where.equal(appelOffre),
        période: Where.equal(periode),
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        localité: {
          région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
        },
      },
      join: [
        {
          entity: 'raccordement',
          on: 'identifiantProjet',
          where: {
            identifiantGestionnaireRéseau:
              scope.type === 'gestionnaire-réseau'
                ? Where.equal(scope.identifiantGestionnaireRéseau)
                : undefined,
          },
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

  mediator.register('Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre', handler);
};

type MapToReadModelProps = (
  projet: LauréatEntity & Joined<ProjetAvecAchevementATransmettreJoins>,
  dossiers: Array<DossierRaccordementEntity>,
) => ProjetAvecAchevementATransmettre | undefined;

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
    identifiantGestionnaireReseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    appelOffre: idProjet.appelOffre,
    periode: idProjet.période,
    referenceDossierRaccordement: dossier.référence,
    dateDCR: dossier.demandeComplèteRaccordement?.dateQualification
      ? DateTime.convertirEnValueType(dossier.demandeComplèteRaccordement.dateQualification)
      : undefined,
    codePostal,
    prix: prixReference,
    coefficientKChoisi: !!coefficientKChoisi,
  };
};
