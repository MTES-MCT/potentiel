import { Colonne } from '../Colonne';

export const localisationProjet: Readonly<Array<Colonne>> = [
  {
    source: 'champ-simple',
    nomColonneTableProjet: 'adresseProjet',
    intitulé: 'N°, voie, lieu-dit',
  },
  { source: 'champ-simple', nomColonneTableProjet: 'codePostalProjet', intitulé: 'CP' },
  { source: 'champ-simple', nomColonneTableProjet: 'communeProjet', intitulé: 'Commune' },
  { source: 'champ-simple', nomColonneTableProjet: 'departementProjet', intitulé: 'Département' },
  { source: 'champ-simple', nomColonneTableProjet: 'regionProjet', intitulé: 'Région' },
];
