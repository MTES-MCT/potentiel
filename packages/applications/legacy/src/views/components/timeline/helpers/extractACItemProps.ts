import { ProjectEventDTO, ProjectStatus } from '../../../../modules/frise';

export type AttestationConformiteItemProps = {
  type: 'attestation-de-conformite';
  date: number;
  covidDelay: boolean;
  délaiCDC2022Appliqué: boolean;
};

export const extractACItemProps = (
  events: ProjectEventDTO[],
  project: { status: ProjectStatus },
): AttestationConformiteItemProps | null => {
  if (project.status !== 'Classé') {
    return null;
  }

  const completionDueOnEvents = events.filter(
    (event) => event.type === 'ProjectCompletionDueDateSet' || event.type == 'CovidDelayGranted',
  );

  const initialProps: AttestationConformiteItemProps = {
    type: 'attestation-de-conformite',
    date: 0,
    covidDelay: false,
    délaiCDC2022Appliqué: false,
  };

  const props = completionDueOnEvents.reduce((props, currentEvent) => {
    return {
      ...props,
      ...('date' in currentEvent && { date: currentEvent.date }),
      ...('délaiCDC2022Appliqué' in currentEvent && { délaiCDC2022Appliqué: true }),
      ...('délaiCDC2022Annulé' in currentEvent && { délaiCDC2022Appliqué: false }),
      ...(currentEvent.type === 'CovidDelayGranted' && { covidDelay: true }),
    };
  }, initialProps);

  return props.date > 0 ? props : null;
};
