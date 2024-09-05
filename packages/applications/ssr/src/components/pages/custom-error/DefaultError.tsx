import { fr } from '@codegouvfr/react-dsfr';

export const DefaultError = () => (
  <>
    <p className={fr.cx('fr-text--lead', 'fr-mb-3w')}>
      Désolé, le service rencontre un problème, nous travaillons à le résoudre le plus rapidement
      possible.
    </p>
    <p className={fr.cx('fr-text--sm', 'fr-mb-5w')}>
      Vous pouvez rafraîchir cette page, ou bien ré-essayer plus tard. <br />
      Si vous avez besoin d’une aide immédiate, merci de nous contacter.
    </p>
  </>
);
