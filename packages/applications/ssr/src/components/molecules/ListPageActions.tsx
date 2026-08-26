import type { FrIconClassName, RiIconClassName } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';

import { DownloadDocument } from '../atoms/form/document';
import { Link } from '../atoms/LinkNoPrefetch';

type LinkActionProps = {
  label: string;
  href: string;
  iconId?: FrIconClassName | RiIconClassName;
  type?: 'link' | 'download-document';
};
export type ListPageActionsProps = {
  actions: ReadonlyArray<LinkActionProps>;
};

export const ListPageActions = ({ actions }: ListPageActionsProps) => (
  <div className="mb-4 flex flex-col">
    {actions.map(({ type = 'link', href, label, iconId }) =>
      type === 'download-document' ? (
        <DownloadDocument key={href} format="pdf" label={label} url={href} />
      ) : (
        <Link
          key={href}
          href={href}
          className={clsx(
            `w-fit fr-link fr-link--icon-right ${iconId} ${actions.length === 1 && 'mb-6'}`,
          )}
        >
          {label}
        </Link>
      ),
    )}
  </div>
);
