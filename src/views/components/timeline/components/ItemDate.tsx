import { afficherDate } from '../../../helpers';
import React from 'react';

export const ItemDate = (props: { date: number }) => (
  <span className="text-sm font-semibold tracking-wide uppercase">{afficherDate(props.date)}</span>
);
