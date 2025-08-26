#!/usr/bin/env -S npm exec --offline tsx

(async () => {
  const oclif = await import('@oclif/core');
  // eslint-disable-next-line no-undef
  await oclif.execute({ development: true, dir: __dirname });
})();
