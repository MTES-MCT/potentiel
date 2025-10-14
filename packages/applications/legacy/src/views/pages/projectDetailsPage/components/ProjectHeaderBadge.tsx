import React from 'react';
import { Badge } from '../../../components';
import { Lauréat } from '@potentiel-domain/projet';
import { match } from 'ts-pattern';

type ProjectHeaderBadgeProps = {
  statutLauréat: Lauréat.StatutLauréat.RawType;
};

export const ProjectHeaderBadge = ({ statutLauréat }: ProjectHeaderBadgeProps) => (
  <div className="flex flex-row gap-2">
    {match(statutLauréat)
      .with('abandonné', () => <Badge type="warning">Abandonné</Badge>)
      .with('achevé', () => <Badge type="success">Achevé</Badge>)
      .with('actif', () => <Badge type="success">Actif</Badge>)
      .exhaustive()}
  </div>
);
