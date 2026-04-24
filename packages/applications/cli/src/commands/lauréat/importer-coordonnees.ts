import { Command, Flags } from '@oclif/core';

import { Where } from '@potentiel-domain/entity';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

export class ImporterCoordonneesCommand extends Command {
  static flags = {
    projet: Flags.string(),
  };
  async run() {
    // à exécuter manuellement en production
    if (process.env.NODE_ENV === 'production') {
      await executeQuery(
        `DROP RULE IF EXISTS prevent_update_on_event_stream on event_store.event_stream;`,
      );
    }

    const { flags } = await this.parse(ImporterCoordonneesCommand);

    const { items } = await listProjection<
      Candidature.DétailCandidatureEntity,
      Candidature.CandidatureEntity
    >(`détail-candidature`, {
      where: {
        identifiantProjet: Where.equal(flags.projet as IdentifiantProjet.RawType),
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
      },
    });

    const stats = {
      ok: 0,
      nok: 0,
      dmsError: 0,
      zero: 0,
    };

    for (const item of items) {
      try {
        const identifiantProjet = item.identifiantProjet;
        if (ignorePériodes.some((p) => identifiantProjet.startsWith(p))) {
          stats.nok++;
          continue;
        }
        const coordonnées = mapCsvRowToCoordonnées(
          { ...item.détail, identifiantProjet },
          item.candidature.localité.région,
        );

        if (coordonnées) {
          if (reverseLongitudeAndLatitude.includes(identifiantProjet)) {
            const lat = coordonnées.latitude;
            coordonnées.latitude = coordonnées.longitude;
            coordonnées.longitude = lat;
          }

          if (reverseLongitudeCardinal.includes(identifiantProjet)) {
            coordonnées.longitude = -coordonnées.longitude;
          }
          if (reverseLatitudeCardinal.includes(identifiantProjet)) {
            coordonnées.latitude = -coordonnées.latitude;
          }
        }

        if (items.length === 1) {
          console.log(
            Object.entries(item.détail).filter(([key]) => key.includes('barycentre')),
            coordonnées,
          );
        }

        // double conversion pour vérifier la précision des calculs et éviter les erreurs d'arrondi
        const vt = coordonnées ? Candidature.Coordonnées.bind(coordonnées) : undefined;
        const dmsOK = vt
          ? vt.estÉgaleÀ(Candidature.Coordonnées.convertirEnValueType(vt.formatter()))
          : false;

        if (vt) {
          if (!dmsOK) {
            stats.dmsError++;
            console.log({
              identifiantProjet,
              coordonnées,
              détail: item.détail,
              msg: "Erreur d'arrondi",
            });
          } else if (Math.abs(vt.latitude) < 1 && Math.abs(vt.longitude) < 1) {
            stats.zero++;
          } else if (vt.latitude === 0 || vt.longitude === 0) {
            stats.zero++;
          } else {
            await executeQuery(
              `update event_store.event_stream
             set payload=jsonb_set(payload, '{coordonnées}', $2::jsonb)
             where stream_id in ('candidature|' || $1, 'lauréat|' || $1)
             and type in ('CandidatureImportée-V1','CandidatureImportée-V2','CandidatureCorrigée-V1','CandidatureCorrigée-V2', 'LauréatNotifié-V1', 'LauréatNotifié-V2')`,
              identifiantProjet,
              JSON.stringify(vt.formatterDecimal()),
            );
            stats.ok++;
          }
        } else {
          stats.nok++;
        }
      } catch (e) {
        console.log({ error: e, item });
        throw e;
      }
    }

    console.log(stats);

    if (process.env.NODE_ENV !== 'production') {
      if (items.length <= 1) {
        await executeQuery(
          `call event_store.rebuild('candidature', $1)`,
          items[0].identifiantProjet,
        );
        await executeQuery(`call event_store.rebuild('lauréat', $1)`, items[0].identifiantProjet);
      } else {
        await executeQuery(`call event_store.rebuild('candidature')`);
        await executeQuery(`call event_store.rebuild('lauréat')`);
      }
    } else {
      console.log('Now, rebuild candidature and lauréat :');
      console.log(`call event_store.rebuild('candidature')`);
      console.log(`call event_store.rebuild('lauréat')`);
    }
  }
}

const cleanup = (value: string | undefined) =>
  value
    ?.trim()
    // excel magic : retirer les dates
    .replace('/01/1900', '')
    .replace(/\(X°YY’ZZ.Z’’ N\/S\).*/, '')
    .replace(/\(X°YY’ZZ.Z’’ E\/O\).*/, '')
    // retirer les caractères non désirés
    .replace(/\?.*/, '')
    // retirer tous les underscore
    .replace(/_/g, '')
    // retirer les caractères non désirés et tout ce qui suit
    .replace(/º.*/, '')
    .replace(/°.*/, '')
    .replace(/‘.*/, '')
    .replace(/''.*/, '')
    .replace(/'.*/, '')
    .replace(/".*/, '')
    .replace(/’’.*/, '')
    .replace(/’.*/, '')
    .replace(/".*/, '')
    // retirer les signes en début ou fin de chaîne
    .replace('Longitude :', '')
    .replace('Latitude :', '')
    .replace(/^[-NSEO]/, '')
    .replace(/[NSEO.]\s*$/, '')
    // nombre francais avec une virgule
    .replace(',', '.')
    .trim() ?? '0';

const cardinalEquivalents: Record<string, string> = {
  N: 'N',
  Nord: 'N',
  S: 'S',
  Sud: 'S',
  E: 'E',
  Est: 'E',
  O: 'O',
  W: 'O',
  Ouest: 'O',
};

export const mapCsvRowToCoordonnées = (rawLine: Record<string, string>, région: string) => {
  const getValue = (axe: string, part: string) =>
    Object.entries(rawLine).find(([key]) =>
      key.match(new RegExp(`${axe}.*\\(${part}\\)`, 'i')),
    )?.[1];

  /** Latitude */

  const latitude_degrés = getValue('latitude', 'degrés');
  const latitude_minutes = getValue('latitude', 'minutes');
  let latitude_secondes = getValue('latitude', 'secondes');
  let latitude_cardinal =
    getValue('latitude', 'cardinal') ?? getValue('latitude', 'point cardinal');

  if (latitude_secondes?.trim().match(/.*[NS]$/)) {
    if (!latitude_cardinal) {
      latitude_cardinal = latitude_secondes.trim().slice(-1);
    }
    latitude_secondes = latitude_secondes.trim().slice(0, -1);
  }
  if (latitude_degrés?.startsWith('-')) {
    latitude_cardinal = 'S';
  }
  if (!latitude_cardinal) {
    latitude_cardinal = régions[région]?.latitude_cardinal;
  }

  /** Longitude */

  const longitude_degrés = getValue('longitude', 'degrés');
  const longitude_minutes = getValue('longitude', 'minutes');
  let longitude_secondes = getValue('longitude', 'secondes');
  let longitude_cardinal =
    getValue('longitude', 'cardinal') ?? getValue('longitude', 'point cardinal');

  if (longitude_secondes?.trim().match(/.*[EWO]$/)) {
    if (!longitude_cardinal) {
      longitude_cardinal = longitude_secondes.trim().slice(-1).replace('W', 'O');
    }
    longitude_secondes = longitude_secondes.trim().slice(0, -1);
  }
  if (longitude_degrés?.startsWith('-')) {
    longitude_cardinal = 'O';
  }
  if (!longitude_cardinal) {
    longitude_cardinal = régions[région]?.longitude_cardinal;
  }

  if (!latitude_degrés && !longitude_degrés) {
    return;
  }
  if (!latitude_cardinal || !longitude_cardinal) {
    return;
  }

  const latitude = {
    degrés: +cleanup(latitude_degrés),
    minutes: +cleanup(latitude_minutes),
    secondes: +cleanup(latitude_secondes),
    cardinal: cardinalEquivalents[latitude_cardinal] as 'N' | 'S',
  };

  const longitude = {
    degrés: +cleanup(longitude_degrés),
    minutes: +cleanup(longitude_minutes),
    secondes: +cleanup(longitude_secondes),
    cardinal: cardinalEquivalents[longitude_cardinal] as 'E' | 'O',
  };
  console.log(latitude, longitude);

  /** Debug des entrées invalides */
  const coords = {
    latitude_degrés,
    latitude_minutes,
    latitude_secondes,
    longitude_degrés,
    longitude_minutes,
    longitude_secondes,
  };

  for (const [key, coord] of Object.entries(coords)) {
    if (Number.isNaN(+cleanup(coord))) {
      console.log({
        key,
        coord: cleanup(coord),
        raw: getValue(key.split('_')[0], key.split('_')[1]),
      });
      return;
    }
  }

  if (latitude.degrés === 0 && latitude.minutes === 0) {
    return;
  }
  if (longitude.degrés === 0 && longitude.minutes === 0) {
    return;
  }

  try {
    return Candidature.Coordonnées.bind({
      latitude: Candidature.Coordonnées.toDecimal(latitude),
      longitude: Candidature.Coordonnées.toDecimal(longitude),
    }).formatterDecimal();
  } catch (e) {
    console.log(e);
  }
};

const régions: Record<string, { latitude_cardinal: 'N' | 'S'; longitude_cardinal: 'E' | 'O' }> = {
  'Nouvelle-Aquitaine': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'O',
  },
  'Hauts-de-France': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  'Auvergne-Rhône-Alpes': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  'Pays de la Loire': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'O',
  },
  Bretagne: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'O',
  },
  'Bourgogne-Franche-Comté': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  Corse: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  'Centre-Val de Loire': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  Occitanie: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  'Île-de-France': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  "Provence-Alpes-Côte d'Azur": {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  'Hauts-de-France / Grand Est': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  Normandie: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  'Grand Est': {
    latitude_cardinal: 'N',
    longitude_cardinal: 'E',
  },
  Martinique: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'O',
  },
  Guadeloupe: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'O',
  },
  Mayotte: {
    latitude_cardinal: 'S',
    longitude_cardinal: 'E',
  },
  'La Réunion': {
    latitude_cardinal: 'S',
    longitude_cardinal: 'E',
  },
  Guyane: {
    latitude_cardinal: 'N',
    longitude_cardinal: 'O',
  },
};

const reverseLongitudeAndLatitude = [
  'PPE2 - Eolien#7##12',
  'PPE2 - Eolien#7##13',
  'PPE2 - Bâtiment#5##119',
  'PPE2 - Bâtiment#5##173',
  'PPE2 - Bâtiment#10##62',
  'PPE2 - Sol#7##66',
  'CRE4 - Sol#7#2#12',
  'CRE4 - Sol#3#2#63',
  'CRE4 - Bâtiment#13#1#359',
  'CRE4 - Bâtiment#13#1#566',
  'CRE4 - Bâtiment#13#1#800',
  'CRE4 - Bâtiment#13#1#807',
  'CRE4 - Bâtiment#10#1#270',
  'CRE4 - Bâtiment#10#1#306',
  'CRE4 - Bâtiment#10#1#301',
  'Eolien#4##28',
  'Eolien#6##8',
];
const reverseLatitudeCardinal = ['PPE2 - Sol#7##66'];
const reverseLongitudeCardinal = [
  'CRE4 - ZNI#1#1c#25',
  'CRE4 - ZNI#1#1c#26',
  'CRE4 - Bâtiment#11#1#610',
  'CRE4 - Bâtiment#12#1#34',
  'CRE4 - Bâtiment#12#1#36',
  'CRE4 - Bâtiment#12#1#64',
  'CRE4 - Bâtiment#12#1#65',
  'CRE4 - Bâtiment#12#1#102',
  'CRE4 - Bâtiment#12#1#103',
  'CRE4 - Bâtiment#12#1#128',
  'CRE4 - Bâtiment#12#1#151',
  'CRE4 - Bâtiment#12#1#152',
  'CRE4 - Bâtiment#12#1#94',
  'CRE4 - Bâtiment#13#1#599',
  'CRE4 - Bâtiment#13#1#56',
  'CRE4 - Autoconsommation ZNI#1##7',
  'PPE2 - Neutre#2##85',
  'PPE2 - Eolien#5##86',

  'PPE2 - Autoconsommation métropole#4##31',
  'PPE2 - Autoconsommation métropole#4##52',
  'PPE2 - Bâtiment#5##134',
  'PPE2 - Bâtiment#8##118',
  'PPE2 - Bâtiment#9##74',
  'PPE2 - Sol#4##163',
  'CRE4 - Bâtiment#13#1#708',
  'PPE2 - Bâtiment#5##117',
  'PPE2 - Bâtiment#5##164',
  'PPE2 - Bâtiment#5##84',
  'PPE2 - Eolien#8##4',
  'PPE2 - Eolien#7##60',
  'PPE2 - Neutre#2##37',
  'CRE4 - Autoconsommation métropole#10##81',
  'CRE4 - Bâtiment#7#1#315',
  'CRE4 - Sol#6#2#36',
  'CRE4 - Sol#7#2#21',

  'CRE4 - Bâtiment#11#1#107',
  'CRE4 - Bâtiment#11#1#244',
  'CRE4 - Bâtiment#11#1#40',
  'CRE4 - Bâtiment#11#1#46',
  'CRE4 - Bâtiment#11#1#76',
  'CRE4 - Bâtiment#1#1#286',
  'CRE4 - Bâtiment#1#1#324',
  'CRE4 - Bâtiment#1#1#306',
  'CRE4 - Bâtiment#1#1#313',
  'CRE4 - Bâtiment#1#1#667',
  'CRE4 - Bâtiment#1#1#711',
  'CRE4 - Bâtiment#1#1#767',
  'CRE4 - Bâtiment#1#1#795',
  'CRE4 - Bâtiment#12#1#17',
  'CRE4 - Bâtiment#12#1#479',
  'CRE4 - Bâtiment#12#1#776',
  'CRE4 - Bâtiment#12#1#797',
  'CRE4 - Bâtiment#12#1#799',
  'CRE4 - Bâtiment#2#1#477',
  'CRE4 - Bâtiment#2#2#132',
  'CRE4 - Bâtiment#3#1#778',
  'CRE4 - Bâtiment#4#1#499',
  'CRE4 - Bâtiment#4#1#498',
  'CRE4 - Bâtiment#5#1#37',
  'CRE4 - Bâtiment#6#1#217',
  'CRE4 - Bâtiment#9#1#140',
  'CRE4 - Sol#4#1#30',
  'CRE4 - Sol#6#2#71',
  'PPE2 - Neutre#1##21',
  'PPE2 - Sol#1##25',
  'PPE2 - Sol#1##6',
  'CRE4 - Bâtiment#11#1#361',
  'CRE4 - Bâtiment#11#1#670',
  'CRE4 - Bâtiment#11#1#512',
  'CRE4 - Bâtiment#11#1#90',
  'CRE4 - Bâtiment#11#1#668',
  'CRE4 - Bâtiment#12#1#429',
  'CRE4 - Bâtiment#12#1#80',
  'CRE4 - Bâtiment#12#1#81',
  'CRE4 - Bâtiment#12#1#97',
  'CRE4 - Bâtiment#12#1#89',
  'PPE2 - Sol#2##39',
  'CRE4 - Bâtiment#11#1#506',
  'CRE4 - Bâtiment#11#1#79',
  'CRE4 - Bâtiment#12#1#43',
  'CRE4 - Bâtiment#12#1#473',
  'CRE4 - Bâtiment#12#1#559',
  'CRE4 - Bâtiment#12#1#702',
  'CRE4 - Bâtiment#12#1#711',
  'CRE4 - Innovation#2#1#23',
  'CRE4 - Innovation#2#1#23',
  'PPE2 - Innovation#1#2#56',
  'CRE4 - Innovation#2#1#23',
  'PPE2 - Innovation#1#2#56',
  'CRE4 - Bâtiment#11#1#246',
  'CRE4 - Autoconsommation métropole 2016#1##129',
  'CRE4 - Autoconsommation métropole#3##44',
  'CRE4 - Autoconsommation métropole#5##12',
  'CRE4 - Bâtiment#11#1#276',
  'CRE4 - Bâtiment#11#1#45',
  'CRE4 - Bâtiment#11#1#48',
  'CRE4 - Bâtiment#1#1#334',
  'CRE4 - Bâtiment#12#1#477',
  'CRE4 - Bâtiment#13#1#1034',
  'CRE4 - Bâtiment#13#1#16',
  'CRE4 - Bâtiment#13#1#56',
  'CRE4 - Bâtiment#13#1#68',
  'CRE4 - Sol#7#2#58',

  'CRE4 - Bâtiment#11#1#553',
  'CRE4 - Autoconsommation métropole#6##15',
  'CRE4 - Bâtiment#7#1#272',
  'CRE4 - Bâtiment#8#1#228',
  'CRE4 - Bâtiment#10#1#218',
  'CRE4 - Bâtiment#11#1#112',
  'CRE4 - Bâtiment#11#1#16',
  'CRE4 - Bâtiment#1#1#99',
  'CRE4 - Bâtiment#2#1#1027',
  'CRE4 - Bâtiment#2#1#1035',
  'CRE4 - Bâtiment#2#1#126',
  'CRE4 - Bâtiment#2#1#107',
  'CRE4 - Bâtiment#2#1#122',
  'CRE4 - Bâtiment#2#1#145',
  'CRE4 - Bâtiment#2#1#213',
  'CRE4 - Bâtiment#2#1#279',
  'CRE4 - Bâtiment#2#1#398',
  'CRE4 - Bâtiment#2#1#480',
  'CRE4 - Bâtiment#3#1#51',
  'CRE4 - Bâtiment#4#1#312',
  'CRE4 - Bâtiment#4#1#41',
  'CRE4 - Bâtiment#4#1#39',
  'CRE4 - Bâtiment#7#1#134',
  'CRE4 - Bâtiment#7#1#2',
  'CRE4 - Bâtiment#7#1#337',
  'CRE4 - Bâtiment#7#1#50',
  'CRE4 - Bâtiment#7#1#45',
  'CRE4 - Bâtiment#7#1#46',
  'CRE4 - Bâtiment#7#1#47',
  'CRE4 - Bâtiment#7#1#51',
  'CRE4 - Bâtiment#7#1#52',
  'CRE4 - Bâtiment#8#1#331',
  'CRE4 - Bâtiment#8#1#333',
  'CRE4 - Bâtiment#8#2#11',
  'CRE4 - Bâtiment#9#1#290',
  'CRE4 - Bâtiment#9#1#348',
  'CRE4 - Bâtiment#9#1#346',
  'CRE4 - Bâtiment#9#1#60',
  'CRE4 - Sol#1#1#15',
  'CRE4 - Sol#2#2#68',
  'CRE4 - Sol#4#2#74',
  'CRE4 - Sol#8#2#32',
  'CRE4 - Sol#9#2#26',
  'PPE2 - Bâtiment#1##19',
  'PPE2 - Bâtiment#1##63',
  'PPE2 - Bâtiment#3##22',
  'PPE2 - Neutre#1##22',
  'PPE2 - Neutre#1##7',
  'CRE4 - Bâtiment#10#1#211',
  'CRE4 - Bâtiment#10#1#379',
  'CRE4 - Bâtiment#11#1#105',
  'CRE4 - Sol#7#2#40',
  'CRE4 - Innovation#3#1#22',
  'CRE4 - Sol#8#2#37',
  'PPE2 - Bâtiment#1##18',
  'PPE2 - Innovation#1#2#36',
  'PPE2 - Neutre#1##55',
  'PPE2 - Innovation#1#2#38',
  'CRE4 - Autoconsommation métropole#8##49',
  'CRE4 - Bâtiment#10#1#205',
  'CRE4 - Bâtiment#11#1#12',
  'CRE4 - Bâtiment#11#1#31',
  'CRE4 - Bâtiment#12#1#607',
  'CRE4 - Bâtiment#2#1#105',
  'CRE4 - Bâtiment#2#1#149',
  'CRE4 - Bâtiment#2#1#247',
  'CRE4 - Bâtiment#2#1#196',
  'CRE4 - Bâtiment#2#1#488',
  'CRE4 - Bâtiment#2#1#538',
  'CRE4 - Bâtiment#2#2#22',
  'CRE4 - Bâtiment#3#1#289',
  'CRE4 - Bâtiment#4#1#60',
  'CRE4 - Bâtiment#4#1#649',
  'CRE4 - Bâtiment#4#1#65',
  'CRE4 - Bâtiment#6#1#187',
  'CRE4 - Bâtiment#6#1#203',
  'CRE4 - Bâtiment#6#1#208',
];

const ignorePériodes = ['PPE2 - Eolien#3#'];
