import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import { Dépôt, DétailCandidature, DétailCandidatureEntity, Localité } from '..';
import { autresTechnologies } from '../détail/csv/fournisseurs';

export type DétailFournisseur = {
  typeFournisseur: string;
  nomDuFabricant?: string;
  lieuDeFabrication?: string;
  coûtTotalLot?: string;
  contenuLocalFrançais?: string;
  contenuLocalEuropéen?: string;
  technologie?: string;
  puissanceCrêteWc?: string;
  rendementNominal?: string; // à voir si on le garde ou pas
};

export type DétailsFournisseurListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
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
  localité: { région },
  sociétéMère,
  'détail-candidature': { détail },
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  région,
  sociétéMère,
  fournisseurs: getFournisseursFromDétail(détail),
});

/***
 * TODO : Cette fonction doit analyser les clés du détail de candidature
 * pour en extraire une liste de fournisseurs (type DétailFournisseur)
 * en se basant sur les clés listées dans les différents fichiers
 * `*.fournisseur.ts`
 */
const getFournisseursFromDétail = (détail: DétailCandidature.RawType): Array<DétailFournisseur> => {
  const fournisseurs: Array<DétailFournisseur> = [];

  fournisseurs.push(...autresTechnologies.mapToDétailFournisseur(détail));

  return [];
};
