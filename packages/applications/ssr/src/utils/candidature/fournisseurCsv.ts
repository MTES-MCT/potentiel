import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

// Etat actuel des colonnes du CSV
const champsCsvFournisseur: Record<Lauréat.Fournisseur.TypeFournisseur.RawType, string> = {
  'module-ou-films': 'Modules ou films',
  cellules: 'Cellules',
  'plaquettes-silicium': 'Plaquettes de silicium (wafers)',
  polysilicium: 'Polysilicium',
  'postes-conversion': 'Postes de conversion',
  structure: 'Structure',
  'dispositifs-stockage-energie': 'Dispositifs de stockage de l’énergie *',
  'dispositifs-suivi-course-soleil': 'Dispositifs de suivi de la course du soleil *',
  'autres-technologies': 'Autres technologies',
  'dispositif-de-production': 'dispositif de production',
  'dispositif-de-stockage': 'Dispositif de stockage',
  'poste-conversion': 'Poste de conversion',
};

// on garde le sens "type" -> "label CSV" ci-dessus pour bénéficier du typage exhaustif
// mais on l'inverse pour l'utilisation
const labelCsvToTypeFournisseur = Object.fromEntries(
  Object.entries(champsCsvFournisseur).map(([key, value]) => [value, key]),
) as Record<string, Lauréat.Fournisseur.TypeFournisseur.RawType>;

const regex = /Nom du fabricant\s?\s\((?<type>.*)\)\s?\d?/;
const mapCsvLabelToTypeFournisseur = (typeValue: string) => {
  const type = typeValue.match(regex)?.groups?.type;
  if (type && labelCsvToTypeFournisseur[type]) {
    return Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(
      labelCsvToTypeFournisseur[type],
    );
  }
  return Option.none;
};

export const mapCsvRowToFournisseurs = (payload: Record<string, string>) => {
  const fournisseurs: Array<Lauréat.Fournisseur.Fournisseur.RawType> = [];

  for (const [key, value] of Object.entries(payload)) {
    const type = mapCsvLabelToTypeFournisseur(key);
    if (Option.isNone(type)) {
      continue;
    }

    fournisseurs.push({
      typeFournisseur: type.formatter(),
      nomDuFabricant: value,
    });
  }

  return fournisseurs;
};
