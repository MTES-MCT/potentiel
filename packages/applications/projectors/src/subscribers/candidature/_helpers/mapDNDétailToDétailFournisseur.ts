import { Candidature } from '@potentiel-domain/projet';

type DétailFournisseur = Candidature.DétailFournisseursCandidatureEntity['fournisseurs'][number];

const CHAMPS = [
  { label: 'Nom du fabricant', property: 'nomDuFabricant' },
  { label: 'Pays de fabrication', property: 'lieuDeFabrication' },
  { label: 'Référence commerciale du fabricant', property: 'référenceCommerciale' },
  { label: 'Technologie', property: 'technologie' },
  { label: 'Coût total du lot', property: 'coûtTotalLot' },
  { label: 'Contenu local français', property: 'contenuLocalFrançais' },
  { label: 'Contenu local européen (y compris français)', property: 'contenuLocalEuropéen' },
] as const;

const TYPES_FOURNISSEURS = [
  { label: 'Poste de conversion', type: 'poste-conversion' },
  { label: 'Dispositif de production', type: 'dispositif-de-production' },
  { label: 'Stockage', type: 'stockage' },
  { label: 'Turbine', type: 'turbine' },
  { label: 'Développement', type: 'développement' },
  { label: 'Génie civil', type: 'génie-civil' },
  { label: 'Postes de conversion', type: 'postes-conversion' },
  { label: 'Composants (modules ou films) photovoltaïques', type: 'module-ou-films' },
  { label: 'Cellules photovoltaïques', type: 'cellules' },
  { label: 'Plaquettes de silicium (wafers)', type: 'plaquettes-silicium' },
  { label: 'Polysilicium', type: 'polysilicium' },
  { label: 'Structure', type: 'structure' },
  { label: 'Composants photovoltaïques', type: 'module-ou-films' },
  { label: 'Wafers', type: 'plaquettes-silicium' },
  { label: 'Onduleurs', type: 'onduleurs' },
  { label: "Stockage de l'énergie", type: 'stockage' },
  { label: 'Suivi de la course du soleil', type: 'dispositifs-suivi-course-soleil' },
  { label: 'Autres technologies', type: 'autres-technologies' },
  { label: 'Génie civil et électrique', type: 'génie-civil' },
  { label: 'Raccordement réseau', type: 'raccordement' },
] as const;

type TypeFournisseur = (typeof TYPES_FOURNISSEURS)[number]['type'];

export const mapDNDétailToDétailFournisseur = (
  détail: Record<string, string>,
): DétailFournisseur[] => {
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const labelToType = Object.fromEntries(
    TYPES_FOURNISSEURS.map(({ label, type }) => [label, type]),
  ) as Record<string, TypeFournisseur>;

  const fournisseursPattern = TYPES_FOURNISSEURS.map(({ label }) => escapeRegex(label)).join('|');
  const champsPattern = CHAMPS.map(({ label }) => escapeRegex(label)).join('|');
  const regex = new RegExp(`(${fournisseursPattern}) - (${champsPattern})(?: - (\\d+))?$`);

  const fournisseurs = Object.entries(détail).reduce<Record<string, DétailFournisseur>>(
    (acc, [rawKey, value]) => {
      const match = rawKey.match(regex);
      if (!match) return acc;

      const [, labelFournisseur, champ, rawIndex] = match;

      const typeFournisseur = labelToType[labelFournisseur];
      if (!typeFournisseur) return acc;

      const index = rawIndex ?? '0';
      const key = `${labelFournisseur}#${index}`;

      if (!acc[key]) {
        acc[key] = {
          typeFournisseur,
        };
      }

      const champLabelToProperty = CHAMPS.find((c) => c.label === champ);

      if (champLabelToProperty) {
        acc[key][champLabelToProperty.property] = value;
      }

      return acc;
    },
    {},
  );

  return Object.values(fournisseurs);
};
