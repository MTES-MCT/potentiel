import { CallOut } from '@/components/atoms/CallOut';

type SectionGarantiesFinancièresProps = {
  content: React.ReactNode;
  actions: React.ReactNode;
};
export const SectionGarantiesFinancières = ({
  content,
  actions,
}: SectionGarantiesFinancièresProps) => {
  return (
    <CallOut
      className="flex-1"
      colorVariant={'info'}
      content={
        <div className="flex flex-col h-full">
          {content}
          {actions}
        </div>
      }
    />
  );
};
