import { getLogger } from '@potentiel/monitoring';
import { DomainError } from '@potentiel-domain/core';
import * as zod from 'zod';

export type FormState = {
  success?: true;
  error?: string;
  validationErrors: string[];
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
      };
    } catch (e) {
      if (e instanceof zod.ZodError) {
        return {
          ...previousState,
          error: `Erreur lors de la validation des données du formulaire`,
          validationErrors: e.issues.map((issue) => (issue.path.pop() || '').toString()),
        };
      }

      if (e instanceof DomainError) {
        return {
          ...previousState,
          error: e.message,
          validationErrors: [],
        };
      }

      getLogger().error(e as Error);
      return {
        error: 'Une erreur est survenue',
        validationErrors: [],
      };
    }
  };
