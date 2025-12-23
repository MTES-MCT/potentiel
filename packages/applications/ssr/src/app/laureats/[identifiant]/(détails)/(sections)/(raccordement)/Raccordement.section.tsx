import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';

import { Section } from '../../(components)/Section';
import { getAbandonInfos, getRaccordement, SectionWithErrorHandling } from '../../../_helpers';

import { RaccordementDétails, RaccordementDétailsProps } from './RaccordementDétails';

type RaccordementSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Raccordement au réseau';

export const RaccordementSection = ({
  identifiantProjet: identifiantProjetValue,
}: RaccordementSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      if (!rôle.aLaPermission('raccordement.consulter')) {
        return null;
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      const abandon = await getAbandonInfos(identifiantProjet.formatter());

      const raccordement = await getRaccordement(identifiantProjet.formatter());

      if (!raccordement) {
        return null;
      }

      const action =
        abandon?.estAbandonné || abandon?.demandeEnCours
          ? undefined
          : {
              label: 'Consulter la page raccordement',
              url: Routes.Raccordement.détail(identifiantProjet.formatter()),
            };

      const alertes =
        rôle.estPorteur() && !abandon?.estAbandonné
          ? getAlertesRaccordement({
              CDC2022Choisi:
                !!cahierDesCharges.cahierDesChargesModificatif &&
                cahierDesCharges.cahierDesChargesModificatif.paruLe === '30/08/2022',
              raccordement,
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
}: {
  CDC2022Choisi: boolean;
  raccordement: Lauréat.Raccordement.ConsulterRaccordementReadModel;
}): RaccordementDétailsProps['alertes'] => {
  const demandeComplèteRaccordementManquanteAlerte =
    "Vous devez déposer une demande de raccordement auprès de votre gestionnaire de réseau. L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région, Cocontractant, etc.).";

  const référenceDossierManquantePourDélaiCDC2022Alerte =
    "Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022 concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué sur la page raccordement est correct.";

  const alertes: RaccordementDétailsProps['alertes'] = [];

  if (raccordement.dossiers.length === 0) {
    alertes.push({ label: demandeComplèteRaccordementManquanteAlerte });
    if (CDC2022Choisi) {
      alertes.push({ label: référenceDossierManquantePourDélaiCDC2022Alerte });
    }
  } else {
    if (!raccordement.dossiers.some((d) => !d.demandeComplèteRaccordement?.accuséRéception)) {
      alertes.push({ label: demandeComplèteRaccordementManquanteAlerte });
    }
  }

  return alertes;
};
