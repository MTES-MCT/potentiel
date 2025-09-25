import { SymbolProps } from '@/components/molecules/ListLegend';

const localité: SymbolProps = {
  iconId: 'fr-icon-map-pin-2-line',
  description: 'Localité',
};

const nomProducteur: SymbolProps = {
  iconId: 'fr-icon-building-line',
  description: 'Nom du producteur',
};

const représentantLégal: SymbolProps = {
  iconId: 'fr-icon-user-line',
  description: 'Représentant légal',
};

const email: SymbolProps = {
  iconId: 'fr-icon-mail-line',
  description: 'Email',
};

const puissance: SymbolProps = {
  iconId: 'fr-icon-flashlight-fill',
  iconColor: 'text-dsfr-yellowTournesol-_850_200-default',
  description: 'Puissance',
};

const prix: SymbolProps = {
  iconId: 'fr-icon-money-euro-circle-line',
  iconColor: 'text-dsfr-orangeTerreBattue-main645-default',
  description: 'Prix de référence',
};

const évaluationCarbone: SymbolProps = {
  iconId: 'fr-icon-cloud-fill',
  iconColor: 'text-dsfr-grey-_625_425-default',
  description: 'Évaluation carbone',
};

const typeActionnariat: SymbolProps = {
  iconId: 'fr-icon-bank-line',
  description: "Type d'actionnariat",
};

export const candidatureListLegendSymbols = [
  localité,
  nomProducteur,
  représentantLégal,
  email,
  puissance,
  prix,
  évaluationCarbone,
  typeActionnariat,
];

export {
  localité,
  nomProducteur,
  représentantLégal,
  email,
  puissance,
  prix,
  évaluationCarbone,
  typeActionnariat,
};
