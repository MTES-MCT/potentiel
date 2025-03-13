import React from 'react';
import { InfoBox } from '../../../components';
import { Routes } from '@potentiel-applications/routes';

// c'est un duplicata du mapping côté SSR, à supprimer après migration de la page projet
const convertStatutAbandonToStatutLabel: Record<string, string> = {
  demandé: 'demandé',
  confirmé: 'confirmé',
  accordé: 'accordé',
  rejeté: 'rejeté',
  annulé: 'annulé',
  'confirmation-demandée': 'à confirmer',
  'en-instruction': 'en instruction',
  inconnu: 'inconnu',
};

type AbandonInfoBoxProps = {
  abandon: { statut: string };
  identifiantProjet: string;
};

export const AbandonInfoBox = ({ abandon, identifiantProjet }: AbandonInfoBoxProps) => {
  return (
    <InfoBox title={`Abandon ${convertStatutAbandonToStatutLabel[abandon.statut]}`}>
      <a href={Routes.Abandon.détail(identifiantProjet)}>Voir les détails de l'abandon</a>
    </InfoBox>
  );
};
