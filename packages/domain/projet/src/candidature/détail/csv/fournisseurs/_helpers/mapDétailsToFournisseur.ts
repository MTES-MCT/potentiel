import { TypeFournisseur } from '../../../../../lauréat/fournisseur';

// Etat actuel des colonnes du CSV
const champsCsvFournisseur: Record<TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': "Dispositifs de stockage de l'énergie",
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
};

// on garde le sens "type" -> "label CSV" ci-dessus pour bénéficier du typage exhaustif
// mais on l'inverse pour l'utilisation
const labelCsvToTypeFournisseur = Object.fromEntries(
  Object.entries(champsCsvFournisseur).map(([key, value]) => [value, key]),
) as Record<string, TypeFournisseur.RawType>;

/**
 * Cas particulier pour le découpage des champs "Contenu local Fabrication de composants et assemblage"
 */
const splitDétailsInftoTypeFieldForFabricationComposantsEtAssemblage = (key: string) => {
  let field = '';

  if (key.includes('Pourcentage de contenu local européen')) {
    field = 'Contenu local européen';
  }

  if (key.includes('Pourcentage de contenu local français')) {
    field = 'Contenu local français';
  }

  if (key.includes('Total coût du lot')) {
    field = 'Coût total du lot';
  }

  return { type: 'Fabrication de composants et assemblage', field, index: undefined };
};

export const splitDétailsIntoTypeFieldIndex = (key: string) => {
  const formattedKey = key
    .replaceAll('’', "'")
    .replaceAll('\n', '')
    .replaceAll('*', '')
    .replaceAll('(x)', '')
    .replaceAll('(%)', '')
    .replaceAll('(M€)', '')
    .replaceAll('(Mi)', '')
    .replaceAll('(Wc)', '')
    .trim();

  if (formattedKey.includes('Contenu local Fabrication de composants et assemblage')) {
    return splitDétailsInftoTypeFieldForFabricationComposantsEtAssemblage(formattedKey);
  }

  /**
   * Regex permettant d'extraire des informations structurées à partir d'une chaîne de caractères
   * représentant un champ, son type et éventuellement un index.
   *
   * Structure attendue : "<nom du champ> (<type du champ>) <index optionnel>"
   *
   * Groupes capturés :
   * - `field` : Le nom du champ (lettres, chiffres, espaces, parenthèses).
   * - `type` : Le type du champ, pouvant inclure des parenthèses imbriquées.
   * - `index` : Un index numérique optionnel à la fin de la chaîne.
   *
   * Exemples de correspondances :
   * - "Nom (string) 1" → field: "Nom", type: "string", index: "1"
   * - "Adresse (string)" → field: "Adresse", type: "string", index: undefined
   */
  const regex = /^(?<field>[^()]+)\s*\((?<type>.+)\)\s*(?<index>\d+)?$/;

  const { type, index, field } = formattedKey.match(regex)?.groups ?? {};
  return { type, field, index };
};

export const mapDétailsToFournisseur = (key: string) => {
  const { field, type, index } = splitDétailsIntoTypeFieldIndex(key);
  if (type && labelCsvToTypeFournisseur[type]) {
    return {
      type: TypeFournisseur.convertirEnValueType(labelCsvToTypeFournisseur[type]).formatter(),
      field: field.trim(),
      index,
    };
  }
};
