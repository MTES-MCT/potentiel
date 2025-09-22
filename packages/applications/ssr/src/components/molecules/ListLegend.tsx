import { FC } from 'react';

import { Icon, IconProps } from '../atoms/Icon';

export type ListLegendProps = {
  symbols: Array<SymbolProps>;
};

export const ListLegend: FC<ListLegendProps> = ({ symbols }) => (
  <div className="mt-8">
    <div className="mb-4">Légende</div>
    <ul className="flex flex-col gap-2 mt-0">
      {symbols.map((symbol) => (
        <li key={symbol.iconId} className="text-sm">
          <Symbol
            iconId={symbol.iconId}
            description={symbol.description}
            iconColor={symbol.iconColor}
          />
        </li>
      ))}
    </ul>
  </div>
);

export type SymbolProps = {
  iconId: IconProps['id'];
  iconColor?: string;
  description: string;
};

const Symbol: FC<SymbolProps> = ({ iconId, iconColor: iconClassname = '', description }) => (
  <>
    <Icon id={iconId} className={`mr-1 ${iconClassname ?? ''}`} size="sm" />
    {description}
  </>
);
