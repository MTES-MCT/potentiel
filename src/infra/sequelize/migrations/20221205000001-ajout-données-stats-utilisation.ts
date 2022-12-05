import { QueryInterface } from 'sequelize'
import { StatistiquesUtilisation } from '@infra/sequelize/tableModels/statistiquesUtilisation.model'

const donnéesAInsérer = [
  {
    id: 8104,
    type: 'connexionUtilisateur',
    date: '2022-12-01 07:00:07.255+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8105,
    type: 'projetConsulté',
    date: '2022-12-01 07:00:39.889+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - ZNI',
        periodeId: '1',
        familleId: '1b',
        numéroCRE: '40',
      },
    },
  },
  {
    id: 8106,
    type: 'connexionUtilisateur',
    date: '2022-12-01 07:38:50.329+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8107,
    type: 'projetConsulté',
    date: '2022-12-01 07:39:08.318+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '10',
        familleId: '1',
        numéroCRE: '237',
      },
    },
  },
  {
    id: 8108,
    type: 'connexionUtilisateur',
    date: '2022-12-01 07:51:06.148+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
    },
  },
  {
    id: 8109,
    type: 'projetConsulté',
    date: '2022-12-01 07:52:22.282+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '8',
        familleId: '1',
        numéroCRE: '281',
      },
    },
  },
  {
    id: 8110,
    type: 'connexionUtilisateur',
    date: '2022-12-01 08:09:49.328+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8111,
    type: 'projetConsulté',
    date: '2022-12-01 08:10:04.377+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '6',
        familleId: '2',
        numéroCRE: '57',
      },
    },
  },
  {
    id: 8112,
    type: 'connexionUtilisateur',
    date: '2022-12-01 08:16:52.569+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8113,
    type: 'projetConsulté',
    date: '2022-12-01 08:16:57.15+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '1',
        familleId: '1',
        numéroCRE: '45',
      },
    },
  },
  {
    id: 8114,
    type: 'projetConsulté',
    date: '2022-12-01 08:18:02.938+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '5',
        familleId: '2',
        numéroCRE: '29',
      },
    },
  },
  {
    id: 8115,
    type: 'connexionUtilisateur',
    date: '2022-12-01 08:25:43.693+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8116,
    type: 'connexionUtilisateur',
    date: '2022-12-01 08:31:23.382+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8117,
    type: 'connexionUtilisateur',
    date: '2022-12-01 08:33:25.591+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8118,
    type: 'projetConsulté',
    date: '2022-12-01 08:35:45.223+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Autoconsommation métropole',
        periodeId: '8',
        numéroCRE: '42',
      },
    },
  },
  {
    id: 8119,
    type: 'projetConsulté',
    date: '2022-12-01 08:39:51.358+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Autoconsommation métropole',
        periodeId: '8',
        numéroCRE: '42',
      },
    },
  },
  {
    id: 8120,
    type: 'connexionUtilisateur',
    date: '2022-12-01 08:56:48.2+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8121,
    type: 'projetConsulté',
    date: '2022-12-01 08:57:08.649+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '3',
        numéroCRE: '6',
      },
    },
  },
  {
    id: 8122,
    type: 'connexionUtilisateur',
    date: '2022-12-01 09:09:13.268+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
    },
  },
  {
    id: 8123,
    type: 'projetConsulté',
    date: '2022-12-01 09:09:23.286+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'Fessenheim',
        periodeId: '1',
        familleId: '3',
        numéroCRE: '2',
      },
    },
  },
  {
    id: 8124,
    type: 'projetConsulté',
    date: '2022-12-01 09:11:34.449+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '11',
        familleId: '1',
        numéroCRE: '444',
      },
    },
  },
  {
    id: 8125,
    type: 'connexionUtilisateur',
    date: '2022-12-01 09:14:43.952+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8126,
    type: 'projetConsulté',
    date: '2022-12-01 09:14:45.52+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '9',
        familleId: '3',
        numéroCRE: '27',
      },
    },
  },
  {
    id: 8127,
    type: 'projetConsulté',
    date: '2022-12-01 09:14:52.895+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '6',
        numéroCRE: '11',
      },
    },
  },
  {
    id: 8128,
    type: 'projetConsulté',
    date: '2022-12-01 09:16:04.176+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '9',
        familleId: '3',
        numéroCRE: '11',
      },
    },
  },
  {
    id: 8129,
    type: 'connexionUtilisateur',
    date: '2022-12-01 09:24:17.642+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8130,
    type: 'connexionUtilisateur',
    date: '2022-12-01 09:26:17.944+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
    },
  },
  {
    id: 8131,
    type: 'projetConsulté',
    date: '2022-12-01 09:27:12.996+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '6',
        familleId: '3',
        numéroCRE: '16',
      },
    },
  },
  {
    id: 8132,
    type: 'connexionUtilisateur',
    date: '2022-12-01 09:27:37.027+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8133,
    type: 'projetConsulté',
    date: '2022-12-01 09:41:03.173+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '2',
      },
    },
  },
  {
    id: 8134,
    type: 'projetConsulté',
    date: '2022-12-01 09:41:55.473+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '2',
      },
    },
  },
  {
    id: 8135,
    type: 'projetConsulté',
    date: '2022-12-01 09:50:01.839+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '9',
        familleId: '3',
        numéroCRE: '11',
      },
    },
  },
  {
    id: 8136,
    type: 'projetConsulté',
    date: '2022-12-01 09:50:28.785+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '9',
        familleId: '3',
        numéroCRE: '11',
      },
    },
  },
  {
    id: 8137,
    type: 'projetConsulté',
    date: '2022-12-01 10:03:34.327+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '6',
        familleId: '2',
        numéroCRE: '58',
      },
    },
  },
  {
    id: 8138,
    type: 'connexionUtilisateur',
    date: '2022-12-01 10:09:36.391+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
    },
  },
  {
    id: 8139,
    type: 'projetConsulté',
    date: '2022-12-01 10:10:12.95+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '5',
        familleId: '2',
        numéroCRE: '47',
      },
    },
  },
  {
    id: 8140,
    type: 'connexionUtilisateur',
    date: '2022-12-01 10:11:06.113+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8141,
    type: 'projetConsulté',
    date: '2022-12-01 10:11:11.771+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '6',
        familleId: '2',
        numéroCRE: '58',
      },
    },
  },
  {
    id: 8142,
    type: 'projetConsulté',
    date: '2022-12-01 10:20:11.171+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8143,
    type: 'projetConsulté',
    date: '2022-12-01 10:26:37.367+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8144,
    type: 'projetConsulté',
    date: '2022-12-01 10:37:57.719+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - ZNI',
        periodeId: '3',
        familleId: '1c',
        numéroCRE: '100',
      },
    },
  },
  {
    id: 8145,
    type: 'projetConsulté',
    date: '2022-12-01 10:38:54.936+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - ZNI',
        periodeId: '3',
        familleId: '1c',
        numéroCRE: '100',
      },
    },
  },
  {
    id: 8146,
    type: 'projetConsulté',
    date: '2022-12-01 10:40:21.35+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '29',
      },
    },
  },
  {
    id: 8147,
    type: 'projetConsulté',
    date: '2022-12-01 10:41:05.321+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '23',
      },
    },
  },
  {
    id: 8148,
    type: 'projetConsulté',
    date: '2022-12-01 10:46:44.115+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '23',
      },
    },
  },
  {
    id: 8578,
    type: 'connexionUtilisateur',
    date: '2022-12-01 10:49:34.114+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8579,
    type: 'connexionUtilisateur',
    date: '2022-12-01 10:51:54.828+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8580,
    type: 'projetConsulté',
    date: '2022-12-01 10:52:03.358+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '2',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8581,
    type: 'projetConsulté',
    date: '2022-12-01 10:53:34.646+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '2',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8582,
    type: 'projetConsulté',
    date: '2022-12-01 10:59:21.906+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '29',
      },
    },
  },
  {
    id: 8583,
    type: 'projetConsulté',
    date: '2022-12-01 10:59:40.933+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '4',
        familleId: '1',
        numéroCRE: '157',
      },
    },
  },
  {
    id: 8584,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:02:03.059+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8585,
    type: 'projetConsulté',
    date: '2022-12-01 11:02:05.611+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '2',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8586,
    type: 'projetConsulté',
    date: '2022-12-01 11:04:30.608+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '29',
      },
    },
  },
  {
    id: 8587,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:10:20.849+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8588,
    type: 'projetConsulté',
    date: '2022-12-01 11:10:47.017+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '11',
        familleId: '2',
        numéroCRE: '25',
      },
    },
  },
  {
    id: 8589,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:11:44.237+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8590,
    type: 'projetConsulté',
    date: '2022-12-01 11:15:15.624+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '3',
        numéroCRE: '9',
      },
    },
  },
  {
    id: 8591,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:22:34.991+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8592,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:23:09.308+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8593,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:24:38.872+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8594,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:28:17.359+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8595,
    type: 'projetConsulté',
    date: '2022-12-01 11:28:19.553+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '2',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8596,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:34:34.612+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8597,
    type: 'projetConsulté',
    date: '2022-12-01 11:34:54.745+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '8',
        numéroCRE: '25',
      },
    },
  },
  {
    id: 8598,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:45:19.32+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8599,
    type: 'projetConsulté',
    date: '2022-12-01 11:46:38.9+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '8',
        familleId: '1',
        numéroCRE: '6',
      },
    },
  },
  {
    id: 8600,
    type: 'attestationTéléchargée',
    date: '2022-12-01 11:49:21.313+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '8',
        familleId: '1',
        numeroCRE: '6',
      },
    },
  },
  {
    id: 8601,
    type: 'connexionUtilisateur',
    date: '2022-12-01 11:56:09.97+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
    },
  },
  {
    id: 8602,
    type: 'projetConsulté',
    date: '2022-12-01 11:56:45.432+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '6',
        familleId: '2',
        numéroCRE: '37',
      },
    },
  },
  {
    id: 8603,
    type: 'connexionUtilisateur',
    date: '2022-12-01 12:12:31.556+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8604,
    type: 'connexionUtilisateur',
    date: '2022-12-01 12:15:41.222+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8605,
    type: 'projetConsulté',
    date: '2022-12-01 12:44:36.195+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '3',
        numéroCRE: '9',
      },
    },
  },
  {
    id: 8606,
    type: 'projetConsulté',
    date: '2022-12-01 12:53:47.492+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '4',
        familleId: '1',
        numéroCRE: '157',
      },
    },
  },
  {
    id: 8607,
    type: 'projetConsulté',
    date: '2022-12-01 12:54:27.798+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '3',
        numéroCRE: '9',
      },
    },
  },
  {
    id: 8608,
    type: 'connexionUtilisateur',
    date: '2022-12-01 12:58:01.546+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8609,
    type: 'projetConsulté',
    date: '2022-12-01 13:00:14.714+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8610,
    type: 'projetConsulté',
    date: '2022-12-01 13:00:31.016+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8611,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:20:38.445+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8612,
    type: 'projetConsulté',
    date: '2022-12-01 13:20:58.621+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '2',
        numéroCRE: '15',
      },
    },
  },
  {
    id: 8613,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:21:09.262+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8614,
    type: 'attestationTéléchargée',
    date: '2022-12-01 13:21:23.854+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '2',
        numeroCRE: '15',
      },
    },
  },
  {
    id: 8615,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:21:54.683+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8616,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:04.196+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '3',
        numéroCRE: '30',
      },
    },
  },
  {
    id: 8617,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:16.411+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '3',
        numéroCRE: '30',
      },
    },
  },
  {
    id: 8618,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:29.259+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '3',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8619,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:38.5+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '15',
      },
    },
  },
  {
    id: 8620,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:49.666+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '15',
      },
    },
  },
  {
    id: 8621,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:56.643+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Sol',
        periodeId: '2',
        numéroCRE: '3',
      },
    },
  },
  {
    id: 8622,
    type: 'projetConsulté',
    date: '2022-12-01 13:22:56.994+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '11',
        familleId: '1',
        numéroCRE: '650',
      },
    },
  },
  {
    id: 8623,
    type: 'projetConsulté',
    date: '2022-12-01 13:23:03.434+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '1',
        numéroCRE: '385',
      },
    },
  },
  {
    id: 8624,
    type: 'projetConsulté',
    date: '2022-12-01 13:23:03.807+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Sol',
        periodeId: '2',
        numéroCRE: '3',
      },
    },
  },
  {
    id: 8625,
    type: 'projetConsulté',
    date: '2022-12-01 13:23:19.209+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '1',
        numéroCRE: '378',
      },
    },
  },
  {
    id: 8626,
    type: 'projetConsulté',
    date: '2022-12-01 13:23:38.485+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '2',
        numéroCRE: '15',
      },
    },
  },
  {
    id: 8627,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:30:29.182+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8628,
    type: 'projetConsulté',
    date: '2022-12-01 13:30:55.13+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '8',
        familleId: '3',
        numéroCRE: '6',
      },
    },
  },
  {
    id: 8629,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:36:37.549+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8630,
    type: 'projetConsulté',
    date: '2022-12-01 13:36:42.622+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '5',
        familleId: '2',
        numéroCRE: '79',
      },
    },
  },
  {
    id: 8631,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:38:20.931+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8632,
    type: 'projetConsulté',
    date: '2022-12-01 13:38:52.301+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '5',
        numéroCRE: '13',
      },
    },
  },
  {
    id: 8633,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:44:59.401+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8634,
    type: 'projetConsulté',
    date: '2022-12-01 13:45:06.578+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8635,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:47:20.124+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8636,
    type: 'projetConsulté',
    date: '2022-12-01 13:47:52.269+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '29',
      },
    },
  },
  {
    id: 8637,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:48:03.276+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8638,
    type: 'projetConsulté',
    date: '2022-12-01 13:49:07.185+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8639,
    type: 'connexionUtilisateur',
    date: '2022-12-01 13:52:11.484+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8640,
    type: 'projetConsulté',
    date: '2022-12-01 13:53:48.539+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8641,
    type: 'projetConsulté',
    date: '2022-12-01 14:05:26.939+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '1',
        numéroCRE: '23',
      },
    },
  },
  {
    id: 8642,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:06:54.822+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8643,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:14:05.84+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8644,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:17:06.345+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8645,
    type: 'projetConsulté',
    date: '2022-12-01 14:19:40.904+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '2',
        numéroCRE: '10',
      },
    },
  },
  {
    id: 8646,
    type: 'projetConsulté',
    date: '2022-12-01 14:21:21.43+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '4',
        numéroCRE: '3',
      },
    },
  },
  {
    id: 8647,
    type: 'attestationTéléchargée',
    date: '2022-12-01 14:21:31.201+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '4',
        familleId: '',
        numeroCRE: '3',
      },
    },
  },
  {
    id: 8648,
    type: 'projetConsulté',
    date: '2022-12-01 14:22:01.233+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '5',
        numéroCRE: '59',
      },
    },
  },
  {
    id: 8649,
    type: 'attestationTéléchargée',
    date: '2022-12-01 14:22:03.031+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '5',
        familleId: '',
        numeroCRE: '59',
      },
    },
  },
  {
    id: 8650,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:24:50.972+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8651,
    type: 'projetConsulté',
    date: '2022-12-01 14:25:11.393+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8652,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:28:08.475+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8653,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:35:20.553+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8654,
    type: 'projetConsulté',
    date: '2022-12-01 14:35:37.647+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '2',
        numéroCRE: '10',
      },
    },
  },
  {
    id: 8655,
    type: 'projetConsulté',
    date: '2022-12-01 14:42:49.821+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8656,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:49:32.725+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8657,
    type: 'projetConsulté',
    date: '2022-12-01 14:49:58.524+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Autoconsommation métropole',
        periodeId: '8',
        numéroCRE: '42',
      },
    },
  },
  {
    id: 8658,
    type: 'attestationTéléchargée',
    date: '2022-12-01 14:50:02.974+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Autoconsommation métropole',
        periodeId: '8',
        familleId: '',
        numeroCRE: '42',
      },
    },
  },
  {
    id: 8659,
    type: 'connexionUtilisateur',
    date: '2022-12-01 14:53:56.365+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
    },
  },
  {
    id: 8660,
    type: 'projetConsulté',
    date: '2022-12-01 14:54:08.92+00',
    données: {
      utilisateur: {
        role: 'acheteur-obligé',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '18',
      },
    },
  },
  {
    id: 8661,
    type: 'projetConsulté',
    date: '2022-12-01 14:59:12.095+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '2',
        numéroCRE: '39',
      },
    },
  },
  {
    id: 8662,
    type: 'projetConsulté',
    date: '2022-12-01 15:03:57.169+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '4',
        familleId: '3',
        numéroCRE: '16',
      },
    },
  },
  {
    id: 8663,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:12:05.536+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8664,
    type: 'projetConsulté',
    date: '2022-12-01 15:12:09.513+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '5',
        numéroCRE: '13',
      },
    },
  },
  {
    id: 8665,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:13:42.976+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8666,
    type: 'projetConsulté',
    date: '2022-12-01 15:13:53.826+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '10',
        familleId: '3',
        numéroCRE: '9',
      },
    },
  },
  {
    id: 8667,
    type: 'projetConsulté',
    date: '2022-12-01 15:16:50.749+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '8',
        familleId: '3',
        numéroCRE: '6',
      },
    },
  },
  {
    id: 8668,
    type: 'projetConsulté',
    date: '2022-12-01 15:17:15.965+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '9',
        familleId: '3',
        numéroCRE: '11',
      },
    },
  },
  {
    id: 8669,
    type: 'projetConsulté',
    date: '2022-12-01 15:23:57.407+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '4',
        familleId: '3',
        numéroCRE: '16',
      },
    },
  },
  {
    id: 8670,
    type: 'projetConsulté',
    date: '2022-12-01 15:25:54.807+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '2',
        numéroCRE: '31',
      },
    },
  },
  {
    id: 8671,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:28:40.192+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8672,
    type: 'projetConsulté',
    date: '2022-12-01 15:28:43.641+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        numéroCRE: '1',
      },
    },
  },
  {
    id: 8673,
    type: 'attestationTéléchargée',
    date: '2022-12-01 15:29:47.637+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'PPE2 - Autoconsommation métropole',
        periodeId: '2',
        familleId: '',
        numeroCRE: '1',
      },
    },
  },
  {
    id: 8674,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:51:22.953+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8675,
    type: 'projetConsulté',
    date: '2022-12-01 15:51:32.159+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Sol',
        periodeId: '7',
        familleId: '2',
        numéroCRE: '18',
      },
    },
  },
  {
    id: 8676,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:52:11.297+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
    },
  },
  {
    id: 8677,
    type: 'projetConsulté',
    date: '2022-12-01 15:52:38.683+00',
    données: {
      utilisateur: {
        role: 'admin',
      },
      projet: {
        appelOffreId: 'Eolien',
        periodeId: '5',
        numéroCRE: '13',
      },
    },
  },
  {
    id: 8678,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:55:52.912+00',
    données: {
      utilisateur: {
        role: 'dreal',
      },
    },
  },
  {
    id: 8679,
    type: 'projetConsulté',
    date: '2022-12-01 15:57:58.119+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '5',
        familleId: '1',
        numéroCRE: '197',
      },
    },
  },
  {
    id: 8680,
    type: 'projetConsulté',
    date: '2022-12-01 15:58:11.444+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '5',
        familleId: '1',
        numéroCRE: '197',
      },
    },
  },
  {
    id: 8681,
    type: 'projetConsulté',
    date: '2022-12-01 15:58:23.321+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '13',
        familleId: '1',
        numéroCRE: '371',
      },
    },
  },
  {
    id: 8682,
    type: 'connexionUtilisateur',
    date: '2022-12-01 15:58:27.527+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
    },
  },
  {
    id: 8683,
    type: 'projetConsulté',
    date: '2022-12-01 15:58:45.463+00',
    données: {
      utilisateur: {
        role: 'porteur-projet',
      },
      projet: {
        appelOffreId: 'CRE4 - Autoconsommation métropole',
        periodeId: '8',
        numéroCRE: '42',
      },
    },
  },
]

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      let compteur = 0
      for (const { type, date, données } of donnéesAInsérer) {
        await StatistiquesUtilisation.create(
          //@ts-ignore
          { type, date: new Date(date), données },
          { transaction }
        )
        compteur++
      }
      console.log(`${compteur} lignes ajoutées sur ${donnéesAInsérer.length}`)
      await transaction.commit()
    } catch (e) {
      await transaction.rollback()
      console.error(e)
    }
  },

  async down(queryInterface: QueryInterface) {},
}
