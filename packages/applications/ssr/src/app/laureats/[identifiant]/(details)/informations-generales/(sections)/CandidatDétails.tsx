import { TitreChamp } from '@/components/atoms/section/TitreChamp';

export type CandidatDétailsProps = {
  emailContact: string;
};

export const CandidatDétails = ({ emailContact }: CandidatDétailsProps) => (
  <div className="flex flex-col gap-1">
    <TitreChamp>Adresse email de candidature</TitreChamp>
    <span>{emailContact}</span>
  </div>
);
