import Button from '@codegouvfr/react-dsfr/Button';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { getTypeReprésentantLégalLabel } from '../../_helpers/getTypeReprésentantLégalLabel';

export const mapToChangementReprésentantLégalDemandéTimelineItemProps = ({
  event,
  isHistoriqueProjet,
}: {
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent;
  isHistoriqueProjet?: true;
}): TimelineItemProps => {
  const { demandéLe, demandéPar, typeReprésentantLégal, nomReprésentantLégal, identifiantProjet } =
    event.payload;

  return {
    date: demandéLe,
    title: 'Demande de changement de représentant légal déposée',
    acteur: demandéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type :{' '}
          <span className="font-semibold">
            {getTypeReprésentantLégalLabel(typeReprésentantLégal)}
          </span>
        </div>
        <div>
          Nom : <span className="font-semibold">{nomReprésentantLégal}</span>
        </div>
        {isHistoriqueProjet && (
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.ReprésentantLégal.changement.détails(identifiantProjet, demandéLe),
            }}
            aria-label={`Voir le détail de la demande de changement de représentant légal déposée le ${FormattedDate({ date: demandéLe })}`}
          >
            Détail de la demande
          </Button>
        )}
      </div>
    ),
  };
};
