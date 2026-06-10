type FormattedNuméroProps = { value?: string; className?: string };

export const FormattedSIREN = ({ value }: FormattedNuméroProps) => {
  if (!value) return <span>Non renseigné</span>;
  return (
    <span>
      {value.slice(0, 3)} {value.slice(3, 6)} {value.slice(6)}
    </span>
  );
};

export const FormattedSIRET = ({ value, className }: FormattedNuméroProps) => {
  if (!value) return <span>Non renseigné</span>;
  return (
    <span className={className}>
      {value.slice(0, 3)} {value.slice(3, 6)} {value.slice(6, 9)} {value.slice(9)}
    </span>
  );
};
