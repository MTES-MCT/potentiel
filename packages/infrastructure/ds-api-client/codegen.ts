import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:
    'https://raw.githubusercontent.com/demarches-simplifiees/demarches-simplifiees.fr/refs/heads/main/app/graphql/schema.graphql',

  documents: ['src/fragments/*.graphql', 'src/queries/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/client.ts': {
      plugins: [
        { add: { content: '/* eslint-disable */' } },

        { add: { content: '//#region Types', placement: 'content' } },
        'typescript',
        { add: { content: '//#endregion\n', placement: 'content' } },

        { add: { content: '//#region Operations', placement: 'content' } },
        'typescript-operations',
        { add: { content: '//#endregion\n', placement: 'content' } },

        { add: { content: '//#region graphql-request', placement: 'content' } },
        'typescript-graphql-request',
        { add: { content: '//#endregion\n', placement: 'content' } },
      ],
      config: {
        enumsAsTypes: true,
      },
    },
  },
  hooks: { afterOneFileWrite: ['prettier --write'] },
};

export default config;
