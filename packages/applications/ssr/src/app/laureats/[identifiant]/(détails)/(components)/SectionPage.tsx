import { Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const SectionPage = ({ title, children }: Props) => (
  <PageTemplate>
    <div className="flex flex-col gap-4 w-fit min-w-[50%]">
      <Heading2>{title}</Heading2>
      {children}
    </div>
  </PageTemplate>
);
