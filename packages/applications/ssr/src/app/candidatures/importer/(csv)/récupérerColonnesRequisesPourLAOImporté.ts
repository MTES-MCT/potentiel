import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { candidatureCsvHeadersMapping } from '@/utils/candidature';

type RécupérerColonnesRequisesPourLAOImporté = ({
  appelOffres,
  periode,
}: {
  appelOffres: string;
  periode: string;
}) => Promise<
  ReadonlyArray<(typeof candidatureCsvHeadersMapping)[keyof typeof candidatureCsvHeadersMapping]>
>;

export const récupérerColonnesRequisesPourLAOImporté: RécupérerColonnesRequisesPourLAOImporté =
  async ({ appelOffres, periode }) => {
    type CandidatureCsvHeadersMappingKeys = (keyof typeof candidatureCsvHeadersMapping)[];

    const mappingChampSupplémentairesColonnes = {
      autorisationDUrbanisme: ['dateDAutorisationDUrbanisme', 'numéroDAutorisationDUrbanisme'],
      coefficientKChoisi: ['coefficientKChoisi'],
      dispositifDeStockage: [
        'installationAvecDispositifDeStockage',
        'capacitéDuDispositifDeStockageEnKWh',
        'puissanceDuDispositifDeStockageEnKW',
      ],
      installateur: ['installateur'],
      natureDeLExploitation: ['natureDeLExploitation', 'tauxPrévisionnelACI'],
      puissanceALaPointe: ['puissanceALaPointe'],
      puissanceDeSite: ['puissanceDeSite'],
      typologieInstallation: [
        'typeInstallationsAgrivoltaïques',
        'typologieDeBâtiment',
        'obligationDeSolarisation',
        'élémentsSousOmbrière',
      ],
      territoireProjet: ['territoireProjet'],
    } as const satisfies {
      [K in keyof AppelOffre.AppelOffreEntity['champsSupplémentaires']]: CandidatureCsvHeadersMappingKeys;
    };

    //@TODO : query pour récupérer seulement l'AO concerné
    const listeAppelOffres = await mediator.send<AppelOffre.ListerAppelOffreQuery>({
      type: 'AppelOffre.Query.ListerAppelOffre',
      data: { cycle: appelOffres.includes('PPE2') ? 'PPE2' : 'CRE4' },
    });

    // champs supplémentaires de l'AO
    const détailAppelOffres = listeAppelOffres.items.find((ao) => ao.id === appelOffres);
    const champsSupplémentairesAO = détailAppelOffres?.champsSupplémentaires ?? {};
    const champsSupplémentairesPeriode =
      détailAppelOffres?.periodes.find((p) => p.id === periode)?.champsSupplémentaires ?? {};

    const champsSupplémentaires = [
      ...new Set([
        ...(Object.keys(champsSupplémentairesAO) as (keyof typeof champsSupplémentairesAO)[]),
        ...(Object.keys(
          champsSupplémentairesPeriode,
        ) as (keyof typeof champsSupplémentairesPeriode)[]),
      ]),
    ];

    // colonnes des champs supplémentaires de l'AO
    const colonnesChampsSupplémentaires: CandidatureCsvHeadersMappingKeys =
      champsSupplémentaires.flatMap((champ) => mappingChampSupplémentairesColonnes[champ]);

    // colonnes communes à tous les AOs
    const colonnesSupplémentairesPossibles: CandidatureCsvHeadersMappingKeys = Object.values(
      mappingChampSupplémentairesColonnes,
    ).flat();

    const colonnesCommunes = (
      Object.keys(candidatureCsvHeadersMapping) as CandidatureCsvHeadersMappingKeys
    ).filter((key) => !colonnesSupplémentairesPossibles.includes(key));

    // colonnes de l'AO
    return [...colonnesChampsSupplémentaires, ...colonnesCommunes].map(
      (key) => candidatureCsvHeadersMapping[key],
    );
  };
