import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import { Dépôt, DétailCandidature, DétailCandidatureEntity, Localité } from '..';
import { Fournisseur } from '../../lauréat';

/*
Type de fournisseur (Cellules, Polysillicium, Poste de conversion, Développement, etc)

Nom du fournisseur

Lieu de fabrication

Coût total du lot (M€) 

Contenu local français (%)

Contenu local européen (%)

Technologie

Puissance crête (Wc)

Rendement nominal
*/

export type DétailFournisseur = {
  type: Fournisseur.TypeFournisseur.RawType;
  nom?: Fournisseur.Fournisseur.ValueType['nomDuFabricant'];
  lieuFabrication?: Fournisseur.Fournisseur.ValueType['lieuDeFabrication'];
  coûtTotalLot?: string;
  contenuLocalFrançais?: string;
  contenuLocalEuropéen?: string;
  technologie?: string;
  puissanceCrêteWc?: string;
  rendementNominal?: string; // à voir si on le garde ou pas
};

export type DétailsFournisseurListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  période: IdentifiantProjet.ValueType['période'];
  région: Localité.ValueType['région'];
  sociétéMère: Dépôt.ValueType['sociétéMère'];
  fournisseurs: Array<DétailFournisseur>;
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
  },
  ListerDétailsFournisseurReadModel
>;

export type ListerDétailsFournisseurQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerDétailsFournisseurQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDétailsFournisseurQueryDependencies) => {
  const handler: MessageHandler<ListerDétailsFournisseurQuery> = async ({ utilisateur }) => {
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
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
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
  mediator.register('Candidature.Query.ListerDétailsFournisseur', handler);
};

type MapToReadModel = (
  candidature: CandidatureEntity & Joined<DétailCandidatureEntity>,
) => DétailsFournisseurListItemReadModel;

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
  fournisseurs: getFournisseursFromDétail(détail),
});

/***
 * TODO : Cette fonction doit analyser les clés du détail de candidature
 * pour en extraire une liste de fournisseurs (type DétailFournisseur)
 * en se basant sur les clés listées dans les différents fichiers
 * `*.fournisseur.csvKeys.ts`
 */
const getFournisseursFromDétail = (détail: DétailCandidature.RawType): Array<DétailFournisseur> => {
  console.log('Détail reçu pour extraction des fournisseurs : ', détail);
  return [];
};
