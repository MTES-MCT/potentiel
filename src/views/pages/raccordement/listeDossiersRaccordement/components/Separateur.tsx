import { ArrowDownWithCircle, ArrowRightWithCircle } from '../../../../components';
import React, { FC } from 'react';

export const Separateur: FC = () => (
  <div className="flex flex-col my-3 mx-auto md:mx-3">
    <ArrowRightWithCircle
      className="w-12 h-12 my-auto text-blue-france-sun-base hidden md:block"
      aria-hidden
    />
    <ArrowDownWithCircle
      className="w-12 h-12 my-auto text-blue-france-sun-base block md:hidden"
      aria-hidden
    />
  </div>
);
