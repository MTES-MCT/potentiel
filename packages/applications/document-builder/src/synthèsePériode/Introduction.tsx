import { Text } from '@react-pdf/renderer';
import type { FC } from 'react';

export type IntroductionProps = {
  période: {
    titre: string;
    cycleAppelOffres: string;
    titreAppelOffres: string;
    puissanceRecherchée: string;
  };
  synthèse: {
    candidats: { nombre: string; puissanceCumulée: string };
    lauréats: { nombre: string; puissanceCumulée: string; prixMoyenPondéré: string };
  };
};

export const Introduction: FC<IntroductionProps> = ({ période, synthèse }) => {
  return (
    <>
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>
        Lauréats de la {période.titre} période de l’appel d’offres dit "{période.cycleAppelOffres}"{' '}
        {période.titreAppelOffres}.
      </Text>

      <Text style={{ fontSize: 10, marginBottom: 5 }}>
        {synthèse.candidats.nombre} dossiers ont été déposés pour une puissance cumulée de{' '}
        {synthèse.candidats.puissanceCumulée} MW(c) la puissance recherchée lors de cette période
        étant de {période.puissanceRecherchée} MW(c)
      </Text>

      <Text style={{ fontSize: 10, marginBottom: 15 }}>
        {synthèse.lauréats.nombre} projets ont été retenus, représentant une puissance cumulée de{' '}
        {synthèse.lauréats.puissanceCumulée} MW(c) et un prix moyen pondéré de{' '}
        {synthèse.lauréats.prixMoyenPondéré} €/MW(c).
      </Text>
    </>
  );
};
