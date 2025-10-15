import { Lauréat } from '@potentiel-domain/projet';

export const mapToÉvaluationCarboneModifiéeTimelineItemsProps = (
  record: Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent,
) => {
  const { modifiéeLe, modifiéePar, évaluationCarboneSimplifiée } = record.payload;

  return {
    date: modifiéeLe,
    title: (
      <div>
        Évaluation carbone simplifiée modifiée par{' '}
        {<span className="font-semibold">{modifiéePar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle évaluation carbone simplifiée :{' '}
          <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
        </div>
      </div>
    ),
  };
};
