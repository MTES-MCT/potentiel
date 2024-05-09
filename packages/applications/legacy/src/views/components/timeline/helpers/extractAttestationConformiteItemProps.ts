import { ProjectEventDTO, ProjectStatus } from '../../../../modules/frise';

export type AttestationConformiteItemProps = {
  type: 'attestation-de-conformite';
  covidDelay: boolean;
  délaiCDC2022Appliqué: boolean;
};

/**
 * @todo Je sais pas si on doit encore utilsier ça pour la frise avec la nouvelle feature de transmission de l'attestation de conformité
 */
export const extractAttestationConformiteItemProps = (
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
    covidDelay: false,
    délaiCDC2022Appliqué: false,
  };

  const props = completionDueOnEvents.reduce((props, currentEvent) => {
    return {
      ...props,
      ...('délaiCDC2022Appliqué' in currentEvent && { délaiCDC2022Appliqué: true }),
      ...('délaiCDC2022Annulé' in currentEvent && { délaiCDC2022Appliqué: false }),
      ...(currentEvent.type === 'CovidDelayGranted' && { covidDelay: true }),
    };
  }, initialProps);

  return props;
};
