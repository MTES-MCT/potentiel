const INVISIBLE_CHARACTERS = /[​-‍⁠﻿]/g;
const WHITESPACES = /[^\S\n]+/g;
const LIST_ITEM_START = /^[-–•*]\s/;

const normalizeLine = (line: string) => line.replace(WHITESPACES, ' ').trim();

export const normalizeTextArea = (text: string): string =>
  text
    .replace(/\r\n?/g, '\n')
    .replace(INVISIBLE_CHARACTERS, '')
    .split('\n')
    .map(normalizeLine)
    .filter((line) => line !== '')
    .reduce((result, line) => {
      if (result === '') {
        return line;
      }
      const separator = LIST_ITEM_START.test(line) ? '\n' : ' ';
      return `${result}${separator}${line}`;
    }, '');
