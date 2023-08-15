import { FinanceIcon } from '../../../components';
import React, { ComponentProps, FC } from 'react';

export const TitreGarantiesFinancières: FC<ComponentProps<'div'>> = () => (
  <div className="flex items-center">
    <FinanceIcon className="mr-2" aria-hidden />
    <span>Garanties Financières</span>
  </div>
);
