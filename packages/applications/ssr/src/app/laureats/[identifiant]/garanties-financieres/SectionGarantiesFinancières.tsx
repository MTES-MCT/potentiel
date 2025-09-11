import { CallOut } from '@/components/atoms/CallOut';

type SectionGarantiesFinancièresProps = {
  content: React.ReactNode;
  actions: React.ReactNode;
  colorVariant?: 'info' | 'success';
};
export const SectionGarantiesFinancières = ({
  content,
  actions,
  colorVariant = 'info',
}: SectionGarantiesFinancièresProps) => {
  return (
    <CallOut
      className="flex-1"
      colorVariant={colorVariant}
      content={
        <div className="flex flex-col h-full">
          {content}
          {actions}
        </div>
      }
    />
  );
};
