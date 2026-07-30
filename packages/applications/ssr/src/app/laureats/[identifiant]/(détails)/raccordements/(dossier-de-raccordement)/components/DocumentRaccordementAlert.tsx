import Notice from '@codegouvfr/react-dsfr/Notice';

export const DocumentRaccordementAlert = () => (
  <Notice
    severity="info"
    title=""
    description={
      <span>
        Transmettre la <span className="font-semibold">proposition technique et financière</span> et
        la <span className="font-semibold">convention de raccordement</span> ou la{' '}
        <span className="font-semibold">convention de raccordement directe</span> du projet
        facilitera vos démarches administratives avec le cocontractant et l'administration connectés
        à Potentiel.
        <br />
        Le dépôt dans Potentiel est informatif, il ne remplace pas les échanges administratifs avec
        votre gestionnaire de réseau.
      </span>
    }
  />
);
