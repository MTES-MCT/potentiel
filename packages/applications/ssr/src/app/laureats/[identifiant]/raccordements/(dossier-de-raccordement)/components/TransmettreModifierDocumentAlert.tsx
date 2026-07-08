import Alert from '@codegouvfr/react-dsfr/Alert';

export const TransmettreOuModifierDocumentAlert = () => (
  <Alert
    severity="info"
    small
    description={
      <div className="py-4 text-justify">
        Transmettre la <span className="font-semibold">proposition technique et financière</span> et
        la <span className="font-semibold">convention de raccordement</span> ou la{' '}
        <span className="font-semibold">convention de raccordement directe du projet</span>{' '}
        facilitera vos démarches administratives avec le cocontractant et l'administration connectés
        à Potentiel, notamment pour des retards de délai de raccordement. <br />
        Le dépôt dans Potentiel est informatif, il ne remplace pas les échanges administratifs avec
        votre gestionnaire de réseau.
      </div>
    }
  />
);
