import z from 'zod';
import { fr as zodFr } from 'zod/locales';
z.config(zodFr());

z.config({
  ...zodFr(),
  customError: (issue) => {
    if (
      (issue.inst instanceof z.ZodNumber &&
        issue.inst.minValue !== null &&
        issue.inst.minValue >= 0) ||
      (issue.code == 'too_small' && issue.origin === 'number')
    ) {
      return 'Le champ doit être un nombre positif';
    }
    if (issue.code === 'invalid_type' && issue.expected === 'number') {
      return 'Le champ doit être un nombre';
    }
    if (!issue.input && (issue.code === 'invalid_type' || issue.code === 'too_small')) {
      return 'Le champ est requis';
    }
  },
});
