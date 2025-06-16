import { Actionnaire } from '@potentiel-domain/laureat';

import { MapToActionnaireTimelineItemProps } from '../mapToActionnaireTimelineItemProps';

export const mapToChangementActionnaireAnnuléTimelineItemProps: MapToActionnaireTimelineItemProps =
  (changementAnnulé, icon) => {
    const { annuléLe, annuléPar } =
      changementAnnulé.payload as Actionnaire.ChangementActionnaireAnnuléEvent['payload'];

    return {
      date: annuléLe,
      icon,
      title: (
        <div>
          Demande de changement d'actionnaire annulée par{' '}
          {<span className="font-semibold">{annuléPar}</span>}
        </div>
      ),
    };
  };
