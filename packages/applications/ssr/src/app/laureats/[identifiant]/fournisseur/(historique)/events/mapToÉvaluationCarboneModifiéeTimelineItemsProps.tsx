import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToÉvaluationCarboneModifiéeTimelineItemsProps = (
  event: Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent,
): TimelineItemProps => {
  const { modifiéeLe, modifiéePar, évaluationCarboneSimplifiée } = event.payload;

  return {
    date: modifiéeLe,
    title: 'Évaluation carbone simplifiée modifiée',
    actor: modifiéePar,
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle évaluation carbone simplifiée :{' '}
          <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
        </div>
      </div>
    ),
  };
};
