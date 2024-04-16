import { FC } from 'react';

import { Icon } from '@/components/atoms/Icon';

export const Separateur: FC = () => (
  <div className="flex flex-col my-3 mx-auto md:mx-3">
    <Icon
      id="fr-icon-arrow-right-fill"
      size="lg"
      className="my-auto hidden md:block text-theme-blueFrance"
    />
    <Icon
      id="fr-icon-arrow-down-fill"
      size="lg"
      className="my-auto block md:hidden text-theme-blueFrance"
    />
  </div>
);
