import { FrIconClassName, RiIconClassName } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';

import { Link } from '../atoms/LinkNoPrefetch';

type LinkActionProps = {
  label: string;
  href: string;
  iconId?: FrIconClassName | RiIconClassName;
};
export type ListPageActionsProps = {
  actions: ReadonlyArray<LinkActionProps>;
};

export const ListPageActions = ({ actions }: ListPageActionsProps) => (
  <div className="mb-4 flex flex-col">
    {actions.map((a) => (
      <Link
        key={a.href}
        href={a.href}
        className={clsx(`w-fit fr-link fr-link--icon-right ${a.iconId}`)}
      >
        {a.label}
      </Link>
    ))}
  </div>
);
