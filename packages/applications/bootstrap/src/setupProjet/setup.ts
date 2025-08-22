import type { SendEmail } from '@potentiel-applications/notifications';
import type { RécupererGRDParVillePort } from '@potentiel-domain/projet';
import type { Unsubscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export type SetupProjetDependencies = {
  sendEmail: SendEmail;
  récupérerGRDParVille: RécupererGRDParVillePort;
};

export type SetupProjet = (dependencies: SetupProjetDependencies) => Promise<Unsubscribe>;
