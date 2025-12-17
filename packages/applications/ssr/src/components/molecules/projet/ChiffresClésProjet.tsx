import { Candidature } from '@potentiel-domain/projet';

import { Icon } from '@/components/atoms/Icon';

import { SymbolProps } from '../ListLegend';

import * as symbols from './liste/ProjectListLegendAndSymbols';

type ChiffreCléProps = {
  valeur: number;
  unité: string;
  symbol: SymbolProps;
};

const ChiffreClé = ({
  valeur,
  unité,
  symbol: { iconId, description, iconColor },
}: ChiffreCléProps) => (
  <div className="flex lg:flex-1 lg:flex-col items-center gap-2" title={description}>
    <Icon id={iconId} className={iconColor} />
    {Number(valeur) > 0 ? (
      <div className="lg:flex lg:flex-col items-center text-center">
        {valeur}
        <span className="ml-1 lg:ml-0 lg:italic text-sm">{unité}</span>
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
  <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm md:text-base">
    <ChiffreClé symbol={symbols.puissance} valeur={puissance.valeur} unité={puissance.unité} />
    <ChiffreClé symbol={symbols.prix} valeur={prixReference} unité="€ par MWh" />
    <ChiffreClé
      symbol={symbols.évaluationCarbone}
      valeur={evaluationCarboneSimplifiée}
      unité="kg eq CO2/kWc"
    />
  </div>
);
