import { CallOut } from '@/components/atoms/CallOut';

type SectionGarantiesFinancièresProps = {
  children: React.ReactNode;
  colorVariant?: 'info' | 'success';
};
export const SectionGarantiesFinancières = ({
  children,
  colorVariant = 'info',
}: SectionGarantiesFinancièresProps) => {
  return (
    <CallOut
      className="flex-1"
      colorVariant={colorVariant}
      content={<div className="flex flex-col h-full">{children}</div>}
    />
  );
};
