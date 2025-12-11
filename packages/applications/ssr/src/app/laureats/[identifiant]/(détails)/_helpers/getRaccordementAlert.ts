import { GetRaccordementForProjectPage } from './getRaccordementData';

export type RaccordementAlertesData = Array<{
  label: string;
}>;

const demandeComplèteRaccordementManquanteAlerte =
  "Vous devez déposer une demande de raccordement auprès de votre gestionnaire de réseau. L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région, Cocontractant, etc.).";

const référenceDossierManquantePourDélaiCDC2022Alerte =
  "Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022 concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué sur la page raccordement est correct.";

export const getAlertesRaccordement = ({
  CDC2022Choisi,
  raccordement,
}: {
  CDC2022Choisi: boolean;
  raccordement: GetRaccordementForProjectPage;
}): RaccordementAlertesData => {
  const alertes: RaccordementAlertesData = [];
  if (!raccordement.value || raccordement.value.nombreDeDossiers === 0) {
    alertes.push({ label: demandeComplèteRaccordementManquanteAlerte });
    if (CDC2022Choisi) {
      alertes.push({ label: référenceDossierManquantePourDélaiCDC2022Alerte });
    }
  } else {
    if (!raccordement.value.aTransmisAccuséRéceptionDemandeRaccordement) {
      alertes.push({ label: demandeComplèteRaccordementManquanteAlerte });
    }
  }

  return alertes;
};
