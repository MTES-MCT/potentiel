import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import { Dépôt, DétailCandidature, DétailCandidatureEntity, Localité } from '..';

export type FournisseurÀLaCandidatureListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  période: IdentifiantProjet.ValueType['période'];
  région: Localité.ValueType['région'];
  sociétéMère: Dépôt.ValueType['sociétéMère'];
  détail: DétailCandidature.RawType;
};

export type ListerFournisseursÀLaCandidatureReadModel = Readonly<{
  items: Array<FournisseurÀLaCandidatureListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerFournisseursÀLaCandidatureQuery = Message<
  'Candidature.Query.ListerFournisseursÀLaCandidature',
  {
    utilisateur: Email.RawType;
  },
  ListerFournisseursÀLaCandidatureReadModel
>;

export type ListerFournisseursÀLaCandidatureQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerCandidaturesQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerFournisseursÀLaCandidatureQueryDependencies) => {
  const handler: MessageHandler<ListerFournisseursÀLaCandidatureQuery> = async ({
    utilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<CandidatureEntity, DétailCandidatureEntity>('candidature', {
      join: {
        entity: 'détail-candidature',
        on: 'identifiantProjet',
      },
      where: {
        localité: {
          région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
        },
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
  mediator.register('Candidature.Query.ListerFournisseursÀLaCandidature', handler);
};

type MapToReadModel = (
  candidature: CandidatureEntity & Joined<DétailCandidatureEntity>,
) => FournisseurÀLaCandidatureListItemReadModel;

export const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  appelOffre,
  période,
  localité: { région },
  sociétéMère,
  'détail-candidature': { détail },
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  appelOffre,
  période,
  région,
  sociétéMère,
  détail: getFournisseursInfosFromDétail(détail),
});

const getFournisseursInfosFromDétail = (détail: DétailCandidature.RawType) => {
  const targetKeys = [
    'Nom du fabricant \n(Plaquettes de silicium (wafers))',
    'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))',
    'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
    'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
    'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
    'Nom du fabricant \n(Polysilicium)',
    'Lieu(x) de fabrication \n(Polysilicium)',
    'Coût total du lot (M€)\n(Polysilicium)',
    'Contenu local français (%)\n(Polysilicium)',
    'Contenu local européen (%)\n(Polysilicium)',
    'Nom du fabricant \n(Postes de conversion)',
    'Lieu(x) de fabrication \n(Postes de conversion)',
    'Coût total du lot (M€)\n(Postes de conversion)',
    'Contenu local français (%)\n(Postes de conversion)',
    'Contenu local européen (%)\n(Postes de conversion)',
    'Nom du fabricant \n(Structure)',
    'Lieu(x) de fabrication \n(Structure)',
    'Coût total du lot (M€)\n(Structure)',
    'Contenu local français (%)\n(Structure)',
    'Contenu local européen (%)\n(Structure)',
    'Technologie \n(Dispositifs de stockage de l’énergie *)',
    'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
    'Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)',
    'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
    'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
    'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
    'Technologie \n(Dispositifs de suivi de la course du soleil *)',
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
    'Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *)',
    'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
    'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
    'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
    'Référence commerciale \n(Autres technologies)',
    'Nom du fabricant \n(Autres technologies)',
    'Lieu(x) de fabrication \n(Autres technologies)',
    'Coût total du lot (M€)\n(Autres technologies)',
    'Contenu local français (%)\n(Autres technologies)',
    'Contenu local européen (%)\n(Autres technologies)',
    'Coût total du lot (M€)\n(Installation et mise en service )',
    'Contenu local français (%)\n(Installation et mise en service) ',
    'Contenu local européen (%)\n(Installation et mise en service)',
    'Commentaires contenu local\n(Installation et mise en service)',
    'Coût total du lot (M€)\n(raccordement)',
    'Contenu local français (%)\n(raccordement)',
    'Contenu local européen (%)\n(raccordement)',
    'Contenu local TOTAL :\ncoût total (M€)',
    'Contenu local TOTAL français (%)',
    'Contenu local TOTAL européen (%)',
    'Contenu local TOTAL :\nCommentaires',
  ];

  const filteredDetails: DétailCandidature.RawType = {};
  for (const key of targetKeys) {
    if (key in détail) {
      filteredDetails[key] = détail[key];
    }
  }
  return filteredDetails;
};
