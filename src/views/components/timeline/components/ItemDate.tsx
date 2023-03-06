import React from 'react';
import { formatDateToString } from '../../../../helpers/formatDateToString';

export const ItemDate = (props: { date: number }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">
    {formatDateToString(props.date)}
  </span>
);
