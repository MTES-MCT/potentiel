import clsx from 'clsx';

import { Candidature } from '@potentiel-domain/projet';

import { Icon } from '@/components/atoms/Icon';

import { SymbolProps } from '../ListLegend';

import * as symbols from './liste/ProjectListLegendAndSymbols';

type ChiffreCléProps = {
  valeur: number;
  unité: string;
  symbol: SymbolProps;
  isLast?: true;
};

const ChiffreClé = ({
  valeur,
  unité,
  symbol: { iconId, description, iconColor },
  isLast,
}: ChiffreCléProps) => (
  <div
    className={clsx(
      !isLast && 'lg:border-r-solid lg:border-r border-dsfr-border-default-grey-default',
      'flex flex-row items-center gap-2 pr-6 pl-1',
    )}
    title={description}
  >
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
    <ChiffreClé symbol={symbols.prix} valeur={prixReference} unité="€ par MWh" />
    <ChiffreClé
      symbol={symbols.évaluationCarbone}
      valeur={evaluationCarboneSimplifiée}
      unité="kg eq CO2/kWc"
      isLast
    />
  </div>
);
