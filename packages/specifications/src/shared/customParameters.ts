import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'valide-invalide',
  regexp: /valide|invalide/,
  transformer: (s) => s as 'valide' | 'invalide',
});

defineParameterType({
  name: 'lauréat-éliminé',
  regexp: /lauréat|éliminé/,
  transformer: (s) => s as 'lauréat' | 'éliminé',
});

defineParameterType({
  name: 'accord-rejet',
  regexp: /accord|rejet/,
  transformer: (s) => s as 'accord' | 'rejet',
});
