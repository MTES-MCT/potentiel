import Badge from '@codegouvfr/react-dsfr/Badge';

export const BadgeDossierRaccordement = ({ estComplet }: { estComplet: boolean }) => {
  return estComplet ? (
    <Badge noIcon small severity="success">
      Complet
    </Badge>
  ) : (
    <Badge noIcon small severity="warning">
      Incomplet
    </Badge>
  );
};
