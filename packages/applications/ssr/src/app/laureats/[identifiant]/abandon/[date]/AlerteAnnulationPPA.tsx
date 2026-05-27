import Notice from '@codegouvfr/react-dsfr/Notice';

export const AlerteAnnulationPPA = () => (
  <Notice
    title="PPA"
    description={
      <span>
        Un contrat de vente de gré à gré (PPA) a été signalé lors de la demande d'abandon. Ce
        signalement sera automatiquement annulé.
      </span>
    }
    severity="info"
  />
);
