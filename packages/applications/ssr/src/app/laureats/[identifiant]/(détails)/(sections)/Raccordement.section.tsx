import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';

import { getAbandonInfos, getLauréat, getRaccordement } from '../../_helpers';

import { RaccordementDétails, RaccordementDétailsProps } from './RaccordementDétails';

type RaccordementSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Raccordement au réseau';

export const RaccordementSection = ({ identifiantProjet }: RaccordementSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      if (!rôle.aLaPermission('raccordement.consulter')) {
        return null;
      }

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

      const abandon = await getAbandonInfos(identifiantProjet);

      const raccordement = await getRaccordement(identifiantProjet);

      const lauréat = await getLauréat(identifiantProjet);

      if (!raccordement) {
        return null;
      }

      const action =
        abandon?.estAbandonné || abandon?.demandeEnCours
          ? undefined
          : {
              label: 'Consulter la page raccordement',
              url: Routes.Raccordement.détail(identifiantProjet),
            };

      const alertes =
        rôle.estPorteur() && !abandon?.estAbandonné
          ? getAlertesRaccordement({
              CDC2022Choisi:
                !!cahierDesCharges.cahierDesChargesModificatif &&
                cahierDesCharges.cahierDesChargesModificatif.paruLe === '30/08/2022',
              raccordement,
              dcrAttendueAvantLe: lauréat.lauréat.notifiéLe.ajouterNombreDeMois(
                cahierDesCharges.période.delaiDcrEnMois.valeur,
              ),
              transmissionAutomatiséeDesDonnéesDeContractualisationAuCocontractant:
                !!cahierDesCharges.appelOffre
                  .transmissionAutomatiséeDesDonnéesDeContractualisationAuCocontractant,
            })
          : [];

      const value = mapToPlainObject(raccordement);

      return (
        <Section title={sectionTitle}>
          <RaccordementDétails raccordement={{ value, action }} alertes={alertes} />
        </Section>
      );
    }),
    sectionTitle,
  );

const getAlertesRaccordement = ({
  CDC2022Choisi,
  raccordement,
  dcrAttendueAvantLe,
  transmissionAutomatiséeDesDonnéesDeContractualisationAuCocontractant,
}: {
  CDC2022Choisi: boolean;
  raccordement: Lauréat.Raccordement.ConsulterRaccordementReadModel;
  dcrAttendueAvantLe: DateTime.ValueType;
  transmissionAutomatiséeDesDonnéesDeContractualisationAuCocontractant: boolean;
}): RaccordementDétailsProps['alertes'] => {
  const formattedDcrAttendueParLeGestionnaireAvantLe = Intl.DateTimeFormat('fr').format(
    new Date(dcrAttendueAvantLe.formatter()),
  );

  const formattedDcrAttendueParPotentielAvantLe = Intl.DateTimeFormat('fr').format(
    new Date(dcrAttendueAvantLe.ajouterNombreDeMois(1).formatter()),
  );

  const demandeComplèteRaccordementManquanteAlerte = `
    Vous devez déposer une demande de raccordement auprès de votre gestionnaire de réseau avant le ${formattedDcrAttendueParLeGestionnaireAvantLe}. 
    
    L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région, Cocontractant, etc.).`;

  const demandeComplèteRaccordementManquanteAlerteSiTransmissionAutomatiséeAuCocontractant = `
    Vous devez déposer une demande complète de raccordement avant le ${formattedDcrAttendueParLeGestionnaireAvantLe} auprès de votre gestionnaire de réseau (sous peine de risque de prélèvement des garanties financières ou à défaut une sanction pécuniaire au titre de l'article L311-15 du code de l'énergie). 
    
    Vous devez déposer cette demande complète de raccordement avant le ${formattedDcrAttendueParPotentielAvantLe} sur Potentiel afin de permettre la contractualisation du projet.
    
    L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région, Cocontractant, etc.).`;

  const référenceDossierManquantePourDélaiCDC2022Alerte =
    "Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022 concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué sur la page raccordement est correct.";

  const alertes: RaccordementDétailsProps['alertes'] = [];

  if (raccordement.dossiers.length === 0) {
    alertes.push({
      label: transmissionAutomatiséeDesDonnéesDeContractualisationAuCocontractant
        ? demandeComplèteRaccordementManquanteAlerteSiTransmissionAutomatiséeAuCocontractant
        : demandeComplèteRaccordementManquanteAlerte,
    });
    if (CDC2022Choisi) {
      alertes.push({ label: référenceDossierManquantePourDélaiCDC2022Alerte });
    }
  } else {
    if (!raccordement.dossiers[0].demandeComplèteRaccordement.accuséRéception) {
      alertes.push({ label: demandeComplèteRaccordementManquanteAlerte });
    }
  }

  return alertes;
};
