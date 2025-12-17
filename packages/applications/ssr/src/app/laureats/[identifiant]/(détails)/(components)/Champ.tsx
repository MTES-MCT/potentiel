import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';

type Exclusive<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];

type PropsPerType = {
  text: string | undefined;
  number: number | undefined;
  date: Iso8601DateTime | undefined;
};
export type ChampProps = {
  label: string;
  unité?: string;
} & Exclusive<PropsPerType>;

export const Champ = ({ date, number, text, label, unité }: ChampProps) => {
  const value = text ? text : number ? number : date ? <FormattedDate date={date} /> : null;

  if (value === undefined || text === '') {
    return <div>Champ non renseigné</div>;
  }

  return (
    <div className="text-nowrap">
      {label} : {value}
      {unité && <span> {unité}</span>}
    </div>
  );
};
