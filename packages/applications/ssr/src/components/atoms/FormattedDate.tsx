import { FC } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

type FormattedDateProps = {
  date: Iso8601DateTime;
  className?: string;
};

export const FormattedDate: FC<FormattedDateProps> = ({ className = '', date }) => (
  <span className={className}>{Intl.DateTimeFormat('fr').format(new Date(date))}</span>
);
