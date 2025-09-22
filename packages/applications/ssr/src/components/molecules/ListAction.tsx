import { LinkAction, LinkActionProps } from '../atoms/LinkAction';

type ListActionProps = {
  actions: ReadonlyArray<LinkActionProps>;
};

export const ListAction = ({ actions }: ListActionProps) => (
  <div className="mb-4">
    {actions.map((a) => (
      <LinkAction key={a.href} label={a.label} href={a.href} iconId={a.iconId} />
    ))}
  </div>
);
