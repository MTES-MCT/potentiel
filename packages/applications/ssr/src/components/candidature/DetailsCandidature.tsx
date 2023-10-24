export type DetailsCandidatureProps = {
  identifiantProjet: string;
};

export const DetailsCandidature = ({ identifiantProjet }: DetailsCandidatureProps) => {
  return <div>{identifiantProjet}</div>;
};
