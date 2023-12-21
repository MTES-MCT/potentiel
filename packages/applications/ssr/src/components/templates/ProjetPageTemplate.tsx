import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { Heading1 } from '../atoms/headings';

export type ProjetPageTemplateProps = {
  heading: React.ReactNode;
  projet: Parameters<typeof ProjetBanner>[0];
  children: React.ReactNode;
};

export const ProjetPageTemplate = ({ heading, projet, children }: ProjetPageTemplateProps) => {
  return (
    <PageTemplate banner={<ProjetBanner {...projet} />}>
      <Heading1 className="mt-0 mb-8">{heading}</Heading1>
      <div>{children}</div>
    </PageTemplate>
  );
};
