import { SendEmail } from '@potentiel-applications/notifications';
import { RécupererGRDParVillePort } from '@potentiel-domain/projet';
import { Unsubscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export type SetupProjetDependencies = {
  sendEmail: SendEmail;
  récupérerGRDParVille: RécupererGRDParVillePort;
};

export type SetupProjet = (dependencies: SetupProjetDependencies) => Promise<Unsubscribe>;
