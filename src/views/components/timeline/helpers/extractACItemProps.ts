import { or } from '../../../../core/utils';
import { is, ProjectEventDTO, ProjectStatus } from '../../../../modules/frise';

export type ACItemProps = {
  type: 'attestation-de-conformite';
  date: number;
  covidDelay?: true;
  délaiCDC2022Appliqué?: true;
};

export const extractACItemProps = (
  events: ProjectEventDTO[],
  project: { status: ProjectStatus },
): ACItemProps | null => {
  if (project.status !== 'Classé') {
    return null;
  }

  const completionDueOnEvents = events.filter(
    or(is('ProjectCompletionDueDateSet'), is('CovidDelayGranted')),
  );

  const latestEvent = completionDueOnEvents.pop();

  const hasCovidDelay = events.some(is('CovidDelayGranted'));

  const hasDélaiCDC2022Appliqué = events.some(
    (event) => event.type === 'ProjectCompletionDueDateSet' && event.délaiCDC2022Appliqué,
  );

  if (latestEvent) {
    return {
      type: 'attestation-de-conformite',
      date: latestEvent.date,
      ...(hasCovidDelay && { covidDelay: true }),
      ...(hasDélaiCDC2022Appliqué && { délaiCDC2022Appliqué: true }),
    };
  }

  return null;
};
