import { SendEmail } from '@potentiel-applications/notifications';
import { Unsubscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export type SetupProjetDependencies = {
  sendEmail: SendEmail;
};

export type SetupProjet = (dependencies: SetupProjetDependencies) => Promise<Unsubscribe>;
