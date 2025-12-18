import { Candidature } from '@potentiel-domain/projet';

import { Icon } from '@/components/atoms/Icon';

import { SymbolProps } from '../ListLegend';

import * as symbols from './liste/ProjectListLegendAndSymbols';

type ChiffreCléProps = {
  valeur: number;
  unité: string;
  symbol: SymbolProps;
};

const Separator = () => (
  <span className="lg:border-r-solid lg:border-r mx-3 border-dsfr-border-default-grey-default" />
);

const ChiffreClé = ({
  valeur,
  unité,
  symbol: { iconId, description, iconColor },
}: ChiffreCléProps) => (
  <div className="flex flex-1 flex-row items-center gap-2" title={description}>
    <Icon id={iconId} className={iconColor} />
    {Number(valeur) > 0 ? (
      <div className="lg:flex lg:flex-col">
        {valeur}
        <span className="ml-1 lg:ml-0 lg:italic lg:text-xs">{unité}</span>
      </div>
    ) : (
      '- - -'
    )}
  </div>
);
type ChiffresClésProjetProps = {
  puissance: {
    valeur: number;
    unité: Candidature.UnitéPuissance.RawType;
  };
  prixReference: number;
  evaluationCarboneSimplifiée: number;
};

export const ChiffresClésProjet = ({
  evaluationCarboneSimplifiée,
  prixReference,
  puissance,
}: ChiffresClésProjetProps) => (
  <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:justify-between max-lg:gap-2 text-sm md:text-base">
    <ChiffreClé symbol={symbols.puissance} valeur={puissance.valeur} unité={puissance.unité} />
    <Separator />
    <ChiffreClé symbol={symbols.prix} valeur={prixReference} unité="€ par MWh" />
    <Separator />
    <ChiffreClé
      symbol={symbols.évaluationCarbone}
      valeur={evaluationCarboneSimplifiée}
      unité="kg eq CO2/kWc"
    />
  </div>
);
