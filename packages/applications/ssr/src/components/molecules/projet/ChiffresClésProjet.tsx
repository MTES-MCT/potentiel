import clsx from 'clsx';

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
  <span className="lg:border-r-solid lg:border-r mx-2 border-dsfr-border-default-grey-default" />
);

const ChiffreClé = ({
  valeur,
  unité,
  symbol: { iconId, description, iconColor },
}: ChiffreCléProps) => (
  <div className="flex flex-1 flex-col items-start justify-center w-full" title={description}>
    <div className="flex flex-row items-center max-lg:gap-4 lg:justify-between w-full">
      <span className={clsx(Number(valeur) > 0 && 'text-2xl')}>
        {Number(valeur) > 0 ? valeur : '- - -'}
      </span>
      <Icon id={iconId} size="lg" className={clsx('opacity-60', iconColor)} />
    </div>
    <div className="italic text-xs">{unité}</div>
  </div>
);
type ChiffresClésProjetProps = {
  puissance: {
    valeur: number;
    unité: Candidature.UnitéPuissance.RawType;
  };
  prixRéférence: number;
  évaluationCarboneSimplifiée: number;
};

export const ChiffresClésProjet = ({
  évaluationCarboneSimplifiée,
  prixRéférence,
  puissance,
}: ChiffresClésProjetProps) => (
  <div className="flex md:flex-1 flex-row justify-between gap-2 text-sm md:text-base flex-wrap">
    <ChiffreClé symbol={symbols.puissance} valeur={puissance.valeur} unité={puissance.unité} />
    <Separator />
    <ChiffreClé symbol={symbols.prix} valeur={prixRéférence} unité="€ par MWh" />
    <Separator />
    <ChiffreClé
      symbol={symbols.évaluationCarbone}
      valeur={évaluationCarboneSimplifiée}
      unité="kg eq CO2/kWc"
    />
  </div>
);
