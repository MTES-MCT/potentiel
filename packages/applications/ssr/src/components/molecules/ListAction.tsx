import { FrIconClassName, RiIconClassName } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';

import { Link } from '../atoms/LinkNoPrefetch';

type LinkActionProps = {
  label: string;
  href: string;
  iconId?: FrIconClassName | RiIconClassName;
};
type ListActionProps = {
  actions: ReadonlyArray<LinkActionProps>;
};

export const ListAction = ({ actions }: ListActionProps) => (
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
