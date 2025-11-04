#! /usr/bin/env -S node --experimental-strip-types
import { execSync } from 'node:child_process';

// send regular logs to stderr so they don't interfere with stdout which is used to capture the output
const log = console.error;
const writePatchVersion = console.log;

function getCurrentBranch(): string {
  return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
}

function getLatestTag(): string {
  try {
    return execSync('git tag --sort=-creatordate | head -n1', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function getBranchVersion(branch: string): string {
  return branch.replace(/^release\//, '');
}

function calculatePatchVersion(branchVersion: string, tagVersion: string): string {
  if (!tagVersion) {
    log(`⚠️ No Tag version`);
    return '0';
  }

  log(`ℹ️ Tag version: ${tagVersion}`);
  const [tagMajor, tagMinor, tagPatch] = tagVersion.split('.');
  const [branchMajor, branchMinor] = branchVersion.split('.');

  log(`❓ Major & minor version are the same for branch & tag ?`);
  if (tagMajor === branchMajor && tagMinor === branchMinor) {
    log(`👍 Yes`);
    const patch = `${parseInt(tagPatch) + 1}`;
    log(`✅ Patch version: ${patch}`);
    return patch;
  } else {
    log(`👎 No`);
    log(`✅ Patch version: 0`);
    return '0';
  }
}

// Main execution
const gitBranch = getCurrentBranch();
const branchVersion = getBranchVersion(gitBranch);
const tagVersion = getLatestTag();

if (!branchVersion) {
  log('❌ No branch version');
  process.exit(1);
}

log(`ℹ️ Git branch: ${gitBranch}`);
log(`ℹ️ Branch version: ${branchVersion}`);

const patchVersion = calculatePatchVersion(branchVersion, tagVersion);
const applicationVersion = `${branchVersion}.${patchVersion}`;

writePatchVersion(applicationVersion);

log(`✅ Application version: ${applicationVersion}`);
