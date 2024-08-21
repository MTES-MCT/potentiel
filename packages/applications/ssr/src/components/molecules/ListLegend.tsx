import { FC } from 'react';

import { Icon, IconProps } from '../atoms/Icon';

export type ListLegendProps = {
  legend: Array<{
    iconId: IconProps['id'];
    description: string;
  }>;
};

export const ListLegend: FC<ListLegendProps> = ({ legend }) => (
  <div className="mt-8">
    <div className="mb-4">Légende</div>
    <ul className="flex flex-col gap-2 mt-0">
      {legend.map((item) => (
        <li key={item.iconId} className="text-sm">
          <Icon id={item.iconId} className="mr-1" size="sm" />
          {item.description}
        </li>
      ))}
    </ul>
  </div>
);
