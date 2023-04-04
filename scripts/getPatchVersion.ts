import { writeFileSync } from 'fs';
import { join } from 'path';

const writePatchVersion = (patch: string) => {
  writeFileSync(join(__dirname, '..', '.patch-version'), patch);
};

const branchVersion = process.env.BRANCH_VERSION || '';
const tagVersion = process.env.TAG_VERSION || '';

if (!branchVersion) {
  console.error('❌ No branch version');
  process.exit(1);
}

console.log(`ℹ️ Branch version: ${branchVersion}`);

if (!tagVersion) {
  console.log(`⚠️ No Tag version`);
  writePatchVersion('0');
  console.log(`✅ Patch version: 0`);
} else {
  console.log(`ℹ️ Tag version: ${tagVersion}`);
  const [tagMajor, tagMinor, tagPatch] = tagVersion.split('.');
  const [branchMajor, branchMinor] = branchVersion.split('.');

  console.log(`❓ Major & minor version are the same for branch & tag ?`);
  if (tagMajor === branchMajor && tagMinor === branchMinor) {
    console.log(`👍 Yes`);
    const patch = `${parseInt(tagPatch) + 1}`;
    writePatchVersion(patch);
    console.log(`✅ Patch version: ${patch}`);
  } else {
    console.log(`👎 No`);
    writePatchVersion('0');
    console.log(`✅Patch version: 0`);
  }
}
