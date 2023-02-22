import { ProjectEventDTO, ProjectStatus } from '@modules/frise';

export type CAItemProps = {
  type: 'contrat-achat';
  status: 'not-submitted';
  date: undefined;
};

export const extractCAItemProps = (
  events: ProjectEventDTO[],
  project: {
    status: ProjectStatus;
  },
): CAItemProps | null => {
  if (!events.length || project.status !== 'Classé') {
    return null;
  }

  const utilisateur = events.filter((event) => event.type === 'ProjectNotified');
  if (
    utilisateur.length !== 0 &&
    !['porteur-projet', 'admin', 'dgec-validateur', 'dreal', 'acheteur-obligé'].includes(
      utilisateur[0].variant,
    )
  ) {
    return null;
  }
  return {
    type: 'contrat-achat',
    status: 'not-submitted',
    date: undefined,
  };
};
