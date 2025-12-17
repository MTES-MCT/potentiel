import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToTypologieInstallationModifiéeTimelineItemsProps = (
  event: Lauréat.Installation.TypologieInstallationModifiéeEvent,
): TimelineItemProps => {
  const { modifiéeLe, modifiéePar, typologieInstallation } = event.payload;

  return {
    date: modifiéeLe,
    title: 'Typologie du projet modifiée',
    acteur: modifiéePar,
    content: (
      <div className="flex flex-col gap-2">
        <div>Nouvelle typologie du projet :</div>
        <DétailTypologieInstallation typologieInstallation={typologieInstallation} />
      </div>
    ),
  };
};
