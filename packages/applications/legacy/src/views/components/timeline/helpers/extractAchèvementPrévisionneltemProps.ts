import { ProjectEventDTO, ProjectStatus } from '../../../../modules/frise';

export type AchèvementPrévisionnelItemProps = {
  type: 'achevement-previsionnel';
  date: number;
  covidDelay: boolean;
  délaiCDC2022Appliqué: boolean;
};

export const extractAchèvementPrévisionnelItemProps = (
  events: ProjectEventDTO[],
  project: { status: ProjectStatus },
): AchèvementPrévisionnelItemProps | null => {
  if (project.status !== 'Classé') {
    return null;
  }

  const completionDueOnEvents = events.filter(
    (event) => event.type === 'ProjectCompletionDueDateSet' || event.type == 'CovidDelayGranted',
  );

  const initialProps: AchèvementPrévisionnelItemProps = {
    type: 'achevement-previsionnel',
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
