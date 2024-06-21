import { Hook } from '@oclif/core';
import dotenv from 'dotenv';

const hook: Hook<'init'> = async function () {
  dotenv.config();
};

export default hook;
