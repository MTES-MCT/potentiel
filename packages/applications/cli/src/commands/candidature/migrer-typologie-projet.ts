import { Command } from '@oclif/core';
import { match, P } from 'ts-pattern';

import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { dbSchema } from '#helpers';

type Stats = {
  total: number;
  sucess: Array<{
    identifiantProjet: IdentifiantProjet.RawType;
    ancienneValeur: string;
  }>;

  errors: { identifiantProjet: IdentifiantProjet.RawType; message: string }[];
};

/*
Bâtiment	1135
Sol	956
Ombrière de parking	526
Candidat à l'AO PV Sol/Neutre - Sol	414
Bâti agricole (serre ou hangar)	244
Ombrière autre	243
Serre agrivoltaïque	197
Ombrière agrivoltaïque	186
PV Sol	168
Bâti standard	126
Hangar agricole	53
AO PV Bâtiment - Ombrière agrivoltaïque	47
Hangar	44
Centre commercial	39
Serre	32
AO PV Bâtiment - Bâtiment	32
Flottant	31
Ombrière	30
Eolien	29
AO PV Sol - Sol	20
AO PV Bâtiment - Serre agrivoltaïque	18
AO PV Bâtiment - Ombrière de parking	18
Candidat à l'AO PV Sol/Neutre - Flottant	16
Mixte	10
Industriel	10
Exploitation	10
Cas 3	10
AO PV Sol - Flottant	9
Candidat à l'AO PV Bâtiment/Neutre - Ombrière agrivoltaïque	9
Bâtiment non agricole	8
Candidat à l'AO PV Bâtiment/Neutre - Ombrière de parking	6
Industrie	5
Centre commercial 	5
Candidat à l'AO PV Bâtiment/Neutre - Bâtiment	4
Commerce	4
AO PV Bâtiment - Ombrière autre	4
Candidat à l'AO PV Bâtiment/Neutre - Serre agrivoltaïque	4
Supermarché 	3
PC	2
Hypermarché	2
Bureaux	2
Exploitation Agricole	2
Methaniseur Agricole 	2
Serre agrivoltaïque + Ombrière agrivoltaïque	2
Producteur 	1
Entrepôt frigorifique	1
Supermarché	1
Methaniseur Agricole	1
Paul-François Croisille	1
ANDRIEU Stéphanie	1
AO PV Bâtiment - Hangar	1
Zoo	1
Serre agrivoltaïque + Hangar	1
Bâtiment agricole	1
PLI_2019_jdvwitkqHt	1
Collectivité 	1
JOBARD Thibaut	1
Public	1
PLI_2019_FmvxZuwgxX	1
industrie	1
STEP	1
PLI_2019_B7vWlnjqBC	1
Cas 3 et autre	1
Transport	1 
*/
type ActualTypologieProjetPossibleValue =
  | 'Centre commercial'
  | 'AO PV Bâtiment - Hangar'
  | "Candidat à l'AO PV Bâtiment/Neutre - Ombrière agrivoltaïque"
  | 'Serre agrivoltaïque + Ombrière agrivoltaïque'
  | 'AO PV Bâtiment - Serre agrivoltaïque'
  | "Candidat à l'AO PV Bâtiment/Neutre - Ombrière de parking"
  | "Candidat à l'AO PV Bâtiment/Neutre - Serre agrivoltaïque"
  | 'Transport'
  | 'AO PV Sol - Flottant'
  | 'Paul-François Croisille'
  | 'Cas 3 et autre'
  | 'Eolien'
  | 'Hangar agricole'
  | 'AO PV Bâtiment - Bâtiment'
  | 'Hypermarché'
  | 'Exploitation Agricole'
  | 'PV Sol'
  | 'Bureaux'
  | 'Bâti agricole (serre ou hangar)'
  | 'Collectivité '
  | 'Cas 3'
  | 'AO PV Bâtiment - Ombrière autre'
  | "Candidat à l'AO PV Sol/Neutre - Flottant"
  | 'Ombrière autre'
  | 'Producteur '
  | 'Methaniseur Agricole'
  | 'Exploitation'
  | 'Serre agrivoltaïque'
  | 'Sol'
  | 'Zoo'
  | 'Public'
  | 'Flottant'
  | 'Bâti standard'
  | 'PLI_2019_FmvxZuwgxX'
  | 'Bâtiment non agricole'
  | 'Supermarché '
  | 'Supermarché'
  | 'Bâtiment agricole'
  | 'Industrie'
  | 'Ombrière de parking'
  | 'Mixte'
  | 'Ombrière'
  | 'PLI_2019_B7vWlnjqBC'
  | 'Centre commercial '
  | 'Bâtiment'
  | 'Entrepôt frigorifique'
  | "Candidat à l'AO PV Sol/Neutre - Sol"
  | 'Ombrière agrivoltaïque'
  | 'JOBARD Thibaut'
  | 'ANDRIEU Stéphanie'
  | 'Industriel'
  | 'Hangar'
  | 'STEP'
  | 'AO PV Sol - Sol'
  | "Candidat à l'AO PV Bâtiment/Neutre - Bâtiment"
  | 'Commerce'
  | 'industrie'
  | 'Serre agrivoltaïque + Hangar'
  | 'PLI_2019_jdvwitkqHt'
  | 'AO PV Bâtiment - Ombrière agrivoltaïque'
  | 'Serre'
  | 'AO PV Bâtiment - Ombrière de parking'
  | 'PC'
  | 'Methaniseur Agricole ';

/*
[
  "bâtiment.neuf", 
  "bâtiment.existant-avec-rénovation-de-toiture", 
  "bâtiment.existant-sans-rénovation-de-toiture", 
  "bâtiment.serre", 
  "bâtiment.serre-agrivoltaïque-pré-aper", 
  "bâtiment.serre-agrivoltaïque-post-aper", 
  "bâtiment.stabulation", 
  "bâtiment.mixte", 
  "bâtiment.non-précisé", 
  
  "ombrière.parking", 
  "ombrière.agrivoltaïque", 
  "ombrière.agrivoltaïque-pré-aper", 
  "ombrière.agrivoltaïque-post-aper", 
  "ombrière.autre", 
  "ombrière.mixte", 
  
  "sol", 
  
  "agrivoltaïque.culture", 
  "agrivoltaïque.jachère-plus-de-5-ans",
  "agrivoltaïque.élevage",
  "agrivoltaïque.serre", 
  "agrivoltaïque.non-précisé"
]
*/

const getTypologieInstallation = (value: ActualTypologieProjetPossibleValue) =>
  match(value)
    .returnType<Candidature.TypologieInstallation.RawType['typologie'] | undefined>()

    //#region BATIMENT
    ///////////// BATIMENT /////////////
    .with(
      P.union('AO PV Bâtiment - Ombrière agrivoltaïque', 'Ombrière agrivoltaïque'),
      () => 'ombrière.agrivoltaïque',
    )

    .with(
      P.union(
        'AO PV Bâtiment - Bâtiment',
        'Bâtiment',
        'Bâti standard',
        "Candidat à l'AO PV Bâtiment/Neutre - Bâtiment",
        'Bâtiment non agricole',
        'Entrepôt frigorifique',
      ),
      () => 'bâtiment.non-précisé',
    )

    /*
      ✨ NEW 'bâtiment.industrie' ? (16 occurences)
    */
    .with(P.union('industrie', 'Industrie', 'Industriel'), () => undefined)

    /*
      ✨ NEW 'bâtiment.hangar' ? (16 occurences)
    */
    .with(P.union('Hangar', 'AO PV Bâtiment - Hangar'), () => undefined)

    /*
      ✨ NEW 'bâtiment.agricole' ? (312 occurences)
    */
    .with(
      P.union(
        'Bâtiment agricole',
        'Bâti agricole (serre ou hangar)',
        'Hangar agricole',
        'Methaniseur Agricole',
        'Methaniseur Agricole ',
        'Exploitation',
        'Exploitation Agricole',
      ),
      () => undefined,
    )

    /* 
      🧐 'bâtiment.serre-agrivoltaïque-pré-aper' OU 'bâtiment.serre-agrivoltaïque-post-aper'
    */
    .with(
      P.union("Candidat à l'AO PV Bâtiment/Neutre - Serre agrivoltaïque"),
      () => 'bâtiment.serre-agrivoltaïque-post-aper',
    )

    /*
      🧐 J'aurais tendance à passer ça en bâtiment non précisé parce que 
      je suis pas sur qu'un nouveau type "bâtiment.centre-commercial" fasse sens (2 occurences)
    */
    .with('Bureaux', () => 'bâtiment.non-précisé')

    /*
      ✨ NEW 'bâtiment.centre-commercial' ? (54 occurences)
    */
    .with(
      P.union(
        'Centre commercial',
        'Centre commercial ',
        'Commerce',
        'Hypermarché',
        'Supermarché',
        'Supermarché ',
      ),
      () => undefined,
    )

    //#region SOL
    ///////////// SOL /////////////

    /*
      🧐 soit 'sol', soit on modifie 'sol' en 'sol.non-précisé'
    */
    .with(
      P.union('AO PV Sol - Sol', 'PV Sol', "Candidat à l'AO PV Sol/Neutre - Sol", 'Sol'),
      () => 'sol',
    )

    /*
      ✨ NEW 'sol.flottant' ?
    */
    .with(
      P.union('AO PV Sol - Flottant', 'Flottant', "Candidat à l'AO PV Sol/Neutre - Flottant"),
      () => undefined,
    )

    //#region OMBRIERE
    .with(
      "Candidat à l'AO PV Bâtiment/Neutre - Ombrière agrivoltaïque",
      () => 'ombrière.agrivoltaïque',
    )

    .with(
      P.union(
        "Candidat à l'AO PV Bâtiment/Neutre - Ombrière de parking",
        'AO PV Bâtiment - Ombrière de parking',
        'Ombrière de parking',
      ),
      () => 'ombrière.parking',
    )

    /* 
      🧐  'ombrière.autre' OU 'ombrière.non-précisé' (NEW ?)
    */

    .with(
      P.union('AO PV Bâtiment - Ombrière autre', 'Ombrière autre', 'Ombrière'),
      () => 'ombrière.autre',
    )

    //#region EOLIEN
    ///////////// EOLIEN /////////////

    /*
      ✨ NEW 'eolien' ?
    */
    .with('Eolien', () => undefined)

    //#region AGRIVOLTAÏQUE

    .with(
      P.union('Serre agrivoltaïque', 'AO PV Bâtiment - Serre agrivoltaïque'),
      () => 'agrivoltaïque.serre',
    )
    .with('Serre agrivoltaïque + Ombrière agrivoltaïque', () => 'ombrière.mixte')

    ///////////// UNDEFINED /////////////

    .with(
      P.union(
        'ANDRIEU Stéphanie',
        'JOBARD Thibaut',
        'Producteur ',
        'Public',
        'Paul-François Croisille',
        'PLI_2019_B7vWlnjqBC',
        'PLI_2019_FmvxZuwgxX',
        'PLI_2019_jdvwitkqHt',
        'Serre',

        'Cas 3',
        'Cas 3 et autre',

        'Collectivité ',

        'Mixte',

        'PC',
        'STEP',

        'Transport',

        'Zoo',
      ),
      () => undefined,
    )

    /* 
      🧐 'agrivolatïque.serre' ou 'bâtiment.hangar'
    */
    .with('Serre agrivoltaïque + Hangar', () => undefined)

    .exhaustive();

export class Migrer extends Command {
  async init() {
    dbSchema.parse(process.env);
  }
  async run() {
    const stats: Stats = {
      total: 0,
      sucess: [],
      errors: [],
    };

    getTypologieInstallation('Bureaux');
  }
}
