import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { NotifierPériodeFormProps, NotifierPériodeForm } from './NotifierPériode.form';

export type NotifierPériodePageProps = NotifierPériodeFormProps;

export const NotifierPériodePage: FC<NotifierPériodePageProps> = ({ périodes }) => {
  return (
    <PageTemplate banner={<Heading1 className="text-theme-white">Notifier une période</Heading1>}>
      <NotifierPériodeForm périodes={périodes} />
    </PageTemplate>
  );
};
