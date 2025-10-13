import { Args, Command } from '@oclif/core';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getProjetAggregateRootAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

export class LoadTest extends Command {
  static description =
    'Runs a load test by executing a given code N times and measures the total time.';

  static args = {
    iterations: Args.integer({
      description: 'Number of times to run the test code',
      default: 100,
      min: 1,
    }),
  };

  async run() {
    const { args } = await this.parse(LoadTest);
    const { iterations } = args;

    // load a ProjetAggregateRoot for a sample IdentifiantProjet
    const testCode = async (identifiantProjetValue: IdentifiantProjet.RawType) => {
      // Create a dummy identifiant projet. We reuse the 'inconnu' pattern to produce a valid value.
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      try {
        await getProjetAggregateRootAdapter(identifiantProjet);
      } catch (err) {
        // swallow errors during load test but keep them visible in stdout
        // so the user can inspect potential issues when running the test.
        this.log(`load error: ${(err as Error).message}`);
      }
    };

    const sql = `SELECT SPLIT_PART(stream_id,'|',2) as "identifiantProjet" FROM event_store.event_stream WHERE stream_id LIKE 'candidature|%' LIMIT $1;`;
    const rows = await executeSelect<{ identifiantProjet: IdentifiantProjet.RawType }>(
      sql,
      iterations,
    );

    if (rows.length < iterations) {
      this.warn(
        `Only ${rows.length} rows found, less than the requested ${iterations} iterations.`,
      );
    }

    const durations: number[] = [];

    for (const { identifiantProjet } of rows) {
      const iterStart = process.hrtime.bigint();
      await testCode(identifiantProjet);
      const iterEnd = process.hrtime.bigint();
      durations.push(Number(iterEnd - iterStart) / 1_000_000);
    }

    const totalDuration = durations.reduce((a, b) => a + b, 0);
    const average = totalDuration / durations.length;
    const sorted = [...durations].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    this.log(`Executed ${durations.length} iterations.`);
    this.log(`Total duration: ${totalDuration.toFixed(2)} ms.`);
    this.log(`Average duration: ${average.toFixed(2)} ms.`);
    this.log(`Median duration: ${median.toFixed(2)} ms.`);
  }
}
