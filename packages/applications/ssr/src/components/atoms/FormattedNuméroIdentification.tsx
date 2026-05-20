export const FormattedSIREN = ({ siren }: { siren?: string }) => {
  if (!siren) return <span>Non renseigné</span>;
  return (
    <span>
      {siren.slice(0, 3)} {siren.slice(3, 6)} {siren.slice(6)}
    </span>
  );
};

export const FormattedSIRET = ({ siret }: { siret?: string }) => {
  if (!siret) return <span>Non renseigné</span>;
  return (
    <span>
      {siret.slice(0, 3)} {siret.slice(3, 6)} {siret.slice(6, 9)} {siret.slice(9)}
    </span>
  );
};
