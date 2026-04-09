import clsx from 'clsx';
import { FC } from 'react';

import { ActionProps, ActionsList } from './ActionsList.template';

type ActionsPageTemplateProps = {
  heading?: React.ReactNode;
  actions: ActionProps[];
  children: React.ReactNode;
  classes?: {
    root?: string;
    content?: string;
    actions?: string;
  };
};

export const ActionsPageTemplate: FC<ActionsPageTemplateProps> = ({
  heading,
  actions,
  children,
  classes,
}) => (
  <div className={clsx('flex flex-col w-full lg:flex-row gap-12 ', classes?.content)}>
    <div className={clsx(`flex-1`, classes?.content)}>
      {heading ?? null}
      {children}
    </div>
    <div className={clsx(`flex-auto md:max-w-lg items-stretch`, classes?.actions)}>
      <ActionsList actions={actions} />
    </div>
  </div>
);
