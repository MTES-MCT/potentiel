import { Then as Alors } from '@cucumber/cucumber';

Alors(
  'la candidature {string} devrait être consultable dans la liste des candidatures',
  function (_nomProjet: string) {
    return 'pending';
  },
);
