import Notice from '@codegouvfr/react-dsfr/Notice';

import { Routes } from '@potentiel-applications/routes';

import { Link } from '@/components/atoms/LinkNoPrefetch';

type Props = { identifiantProjet: string; showLink?: boolean };

export const AucunDossierDeRaccordementAlert = ({ identifiantProjet, showLink = true }: Props) => (
  <Notice
    severity="info"
    title="Données de raccordement à compléter"
    description={
      <>
        <br />
        <span>
          Vous n'avez pas encore transmis votre demande complète de raccordement sur Potentiel.
        </span>
        <br />
        <span>
          L'accusé de réception de cette demande ainsi que les documents complémentaires transmis
          sur Potentiel faciliteront vos démarches administratives avec les différents acteurs
          connectés à Potentiel (DGEC, services de l'Etat en région, Cocontractant, etc.).
        </span>
        {showLink && (
          <>
            <br />
            <Link
              href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet)}
              className="font-semibold w-fit"
            >
              Mettre à jour votre dossier de raccordement
            </Link>
          </>
        )}
      </>
    }
  />
);
