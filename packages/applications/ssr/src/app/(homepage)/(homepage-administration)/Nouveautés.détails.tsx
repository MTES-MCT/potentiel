import Card from '@codegouvfr/react-dsfr/Card';

export const NouveautésDétails = () => (
  <div className="flex gap-2">
    <Card
      background
      border
      desc="Retrouvez les 102 candidats lauréats de votre région (Occitanie)"
      size="small"
      linkProps={{
        href: '#',
      }}
      title="L'appel d'offre PPE2 - Sol, période 9, a été notifiée le 11 septembre 2026"
      titleAs="h3"
    />
    <Card
      background
      border
      desc="Retrouvez les enrichis de nouvelles données dans l'onglet Export"
      enlargeLink
      linkProps={{
        href: '#',
      }}
      size="medium"
      title="Les exports de données ont été mis à jour sur Potentiel"
      titleAs="h3"
    />
  </div>
);
