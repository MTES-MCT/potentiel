const INVISIBLE_CHARACTERS = /[​-‍⁠﻿]/g;
const WHITESPACES = /[^\S\n]+/g;

const normalizeLine = (line: string) => line.replace(WHITESPACES, ' ').trim();

export const normalizeTextArea = (text: string): string =>
  text
    .replace(/\r\n?/g, '\n')
    .replace(INVISIBLE_CHARACTERS, '')
    .split('\n')
    .map(normalizeLine)
    .filter((line) => line !== '')
    .join(' ');
