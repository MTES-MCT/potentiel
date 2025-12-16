import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { Routes } from '@potentiel-applications/routes';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { Section } from '../../(components)/Section';
import { RaccordementDétails, RaccordementDétailsProps } from './RaccordementDétails';
import { mediator } from 'mediateur';
import { getAbandon } from '../../_helpers/getAbandon';
import { Option } from '@potentiel-libraries/monads';
import { getCahierDesCharges } from '../../../../../_helpers';

type RaccordementSectionProps = {
  identifiantProjet: string;
};

export const RaccordementSection = ({
  identifiantProjet: identifiantProjetValue,
}: RaccordementSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    if (!rôle.aLaPermission('raccordement.consulter')) {
      return null;
    }

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const abandon = await getAbandon(identifiantProjet.formatter());

    const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    const gestionnaireRéseau =
      await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    if (Option.isNone(raccordement)) {
      return null;
    }

    const value = {
      nombreDeDossiers: raccordement.dossiers.length,
      gestionnaireDeRéseau: Option.isSome(gestionnaireRéseau)
        ? gestionnaireRéseau.raisonSociale
        : 'Aucun gestionnaire de réseau pour ce projet',
      dateMiseEnService: raccordement.dossiers.length
        ? raccordement.dossiers
            .map((dossier) => dossier.miseEnService?.dateMiseEnService)
            .filter(Boolean)
            .sort()[0]
        : undefined,
      aTransmisAccuséRéceptionDemandeRaccordement: raccordement.dossiers.length
        ? !!raccordement.dossiers[0].demandeComplèteRaccordement.accuséRéception
        : undefined,
    };

    const action =
      abandon?.estAbandonné || abandon?.demandeEnCours
        ? undefined
        : rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre')
          ? {
              label: 'Renseigner les données de raccordement',
              url: Routes.Raccordement.détail(identifiantProjet.formatter()),
            }
          : {
              label: rôle.aLaPermission('raccordement.gestionnaire.modifier')
                ? 'Consulter ou modifier les documents'
                : 'Consulter les documents',
              url: Routes.Raccordement.détail(identifiantProjet.formatter()),
            };

    const alertes = getAlertesRaccordement({
      CDC2022Choisi:
        !!cahierDesCharges.cahierDesChargesModificatif &&
        cahierDesCharges.cahierDesChargesModificatif.paruLe === '30/08/2022',
      raccordement: { value, action },
    });

    return (
      <Section title="Raccordement au réseau">
        <RaccordementDétails raccordement={{ value, action }} alertes={alertes} />
      </Section>
    );
  });

const getAlertesRaccordement = ({
  CDC2022Choisi,
  raccordement,
}: {
  CDC2022Choisi: boolean;
  raccordement: RaccordementDétailsProps['raccordement'];
}): RaccordementDétailsProps['alertes'] => {
  const demandeComplèteRaccordementManquanteAlerte =
    "Vous devez déposer une demande de raccordement auprès de votre gestionnaire de réseau. L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région, Cocontractant, etc.).";

  const référenceDossierManquantePourDélaiCDC2022Alerte =
    "Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022 concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué sur la page raccordement est correct.";

  const alertes: RaccordementDétailsProps['alertes'] = [];

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
