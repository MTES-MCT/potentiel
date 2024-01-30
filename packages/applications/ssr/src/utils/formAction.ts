import * as zod from 'zod';

// import { getLogger } from '@potentiel/monitoring';
import { DomainError } from '@potentiel-domain/core';

export class CsvValidationError extends Error {
  constructor(
    public errors: Array<{
      ligne: string;
      champ: string;
      message: string;
    }>,
  ) {
    super('Erreur lors de la validation du fichier CSV');
  }
}

export type FormState = {
  success?: true;
  error?: string;
  validationErrors: string[];
  csvValidationErrors: Array<{ ligne: string; champ: string; message: string }>;
};

export type FormAction<TState, TSchema extends zod.AnyZodObject = zod.AnyZodObject> = (
  previousState: TState,
  data: zod.infer<TSchema>,
) => Promise<TState>;

export const formAction =
  <TSchema extends zod.AnyZodObject, TState extends FormState>(
    action: FormAction<TState, TSchema>,
    schema?: TSchema,
  ) =>
  async (previousState: TState, formData: FormData) => {
    try {
      const data = schema
        ? schema.parse(Object.fromEntries(formData))
        : Object.fromEntries(formData);

      await action(previousState, data);
      return {
        success: true as const,
        validationErrors: [],
        csvValidationErrors: [],
      };
    } catch (e) {
      if (e instanceof zod.ZodError) {
        return {
          ...previousState,
          error: `Erreur lors de la validation des données du formulaire`,
          validationErrors: e.issues.map((issue) => (issue.path.pop() || '').toString()),
          csvValidationErrors: [],
        };
      }

      if (e instanceof DomainError) {
        return {
          ...previousState,
          error: e.message,
          validationErrors: [],
          csvValidationErrors: [],
        };
      }

      if (e instanceof CsvValidationError) {
        return {
          ...previousState,
          validationErrors: [],
          csvValidationErrors: e.errors,
        };
      }

      return {
        error: 'Une erreur est survenue',
        validationErrors: [],
        csvValidationErrors: [],
      };
    }
  };
