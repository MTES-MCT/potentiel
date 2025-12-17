import { Heading2 } from '@/components/atoms/headings';

type SectionPageProps = {
  title: string;
  children: React.ReactNode;
};

export const SectionPage = ({ title, children }: SectionPageProps) => (
  <div className="flex flex-col gap-4 w-full">
    <Heading2>{title}</Heading2>
    {children}
  </div>
);
