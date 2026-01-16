import { Heading2 } from '@/components/atoms/headings';

type SectionPageProps = {
  title: string;
  children: React.ReactNode;
};

export const SectionPage = ({ title, children }: SectionPageProps) => (
  <div className="flex flex-col gap-4 w-full print:block print:space-y-4">
    <Heading2 className="print:mb-2">{title}</Heading2>
    {children}
  </div>
);
