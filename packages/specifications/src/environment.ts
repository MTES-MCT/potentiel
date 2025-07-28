import path from 'node:path';

import { MinioContainer } from '@testcontainers/minio';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Wait } from 'testcontainers';

export const prepareEnvironment = async () => {
  const repoRoot = path.resolve(__dirname, '../../../');
  const minio = await new MinioContainer('quay.io/minio/minio')
    .withUsername('minioadmin')
    .withPassword('minioadmin')
    .start();
  const postgres = await new PostgreSqlContainer('postgres:16')
    .withExposedPorts(5432)
    .withDatabase('postgres')
    .withUsername('postgres_admin')
    .withPassword('postgres_password')
    .withEnvironment({
      POSTGRES_MULTIPLE_DATABASES: 'potentiel,metabase',
      POSTGRES_HOST_AUTH_METHOD: 'trust',
    })
    .withBindMounts([
      {
        source: path.join(repoRoot, '.database/potentiel-dev.dump'),
        target: '/dump/potentiel-dev.dump',
      },
      {
        source: path.join(repoRoot, '.database/scripts/restore-dev-db.sh'),
        target: '/docker-entrypoint-initdb.d/restore-dev-db.sh',
      },
    ])
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections', 2))
    .start();

  //   const compose = await new DockerComposeEnvironment(repoRoot, 'docker-compose.yml')
  //     .withProfiles('test')
  //     .withWaitStrategy(
  //       'db_test',
  //       Wait.forLogMessage('database system is ready to accept connections', 2),
  //     )
  //     .up();

  //   const postgres = compose.getContainer('db_test-1');
  //   const minio = compose.getContainer('s3_test-1');

  return {
    postgres: {
      port: postgres.getMappedPort(5432),
    },
    s3: {
      port: minio.getMappedPort(9000),
    },
  };
};
