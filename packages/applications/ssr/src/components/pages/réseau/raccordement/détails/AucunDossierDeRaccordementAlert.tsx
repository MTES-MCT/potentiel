import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

type Props = { identifiantProjet: string; showLink?: boolean };

export const AucunDossierDeRaccordementAlert = ({ identifiantProjet, showLink = true }: Props) => (
  <Alert
    severity="warning"
    title="Données de raccordement à compléter"
    description={
      <div className="flex flex-col gap-3 mt-3">
        <p>Vous n'avez pas encore transmis votre demande complète de raccordement sur Potentiel.</p>
        <p>
          L'accusé de réception de cette demande ainsi que les documents complémentaires
          (proposition technique et financière…) transmis sur Potentiel faciliteront vos démarches
          administratives avec les différents acteurs connectés à Potentiel (DGEC, services de
          l'Etat en région, Cocontractant, etc.).
        </p>
        {showLink && (
          <Link
            href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet)}
            className="font-semibold"
          >
            Mettre à jour votre dossier de raccordement
          </Link>
        )}
      </div>
    }
  />
);
