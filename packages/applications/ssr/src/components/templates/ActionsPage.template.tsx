import clsx from 'clsx';

import { Role } from '@potentiel-domain/utilisateur';

import { Heading1 } from '../atoms/headings';

import { ActionsList } from './ActionsList.template';

/** Utility type to define a set of actions, based on policies */
export type Actions<T extends Role.Policy> = T;
export type ActionMap<TAction extends string> = Record<TAction, React.FC>;

type ActionsPageTemplateProps<TAction extends string> = {
  heading?: string;
  badge?: React.ReactNode;
  actionMap: ActionMap<TAction>;
  actions: TAction[];
  children: React.ReactNode;
  classes?: {
    root?: string;
    content?: string;
    actions?: string;
  };
};

export const ActionsPageTemplate = <TAction extends string>({
  heading,
  badge,
  actionMap,
  actions,
  children,
  classes,
}: ActionsPageTemplateProps<TAction>) => (
  <div className={clsx('flex flex-col w-full lg:flex-row gap-12 ', classes?.content)}>
    <div className={clsx(`flex-1`, classes?.content)}>
      {(heading || badge) && (
        <div className={clsx('flex items-center gap-4')}>
          {heading && <Heading1>{heading}</Heading1>}
          {badge}
        </div>
      )}
      {children}
    </div>
    <div className={clsx(`flex-auto mt-5 md:max-w-lg items-stretch`, classes?.actions)}>
      <ActionsList actionsListLength={actions.length}>
        {Object.keys(actionMap)
          .filter((action) => actions.includes(action as TAction))
          .map((action) => {
            const Component = actionMap[action as TAction] as React.FC;
            return <Component key={action} />;
          })}
      </ActionsList>
    </div>
  </div>
);
