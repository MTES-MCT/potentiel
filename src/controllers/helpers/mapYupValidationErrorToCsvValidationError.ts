import { ValidationError } from 'yup';

const getNuméroLigne = (path: string | undefined) => {
  const extractLigne = path?.replace(/\D/g, '');
  if (!extractLigne) {
    return;
  }

  return Number(extractLigne) + 2;
};

export const mapYupValidationErrorToCsvValidationError = (
  error: ValidationError,
): Map<string, string> => {
  return error.inner.reduce((acc, err, index) => {
    const { path, params, errors } = err;
    const numéroLigne = getNuméroLigne(path);

    if (!errors?.length) {
      return acc;
    }

    const valeurInvalide =
      typeof params?.originalValue === 'string' ? params.originalValue : undefined;

    const [raison] = errors;

    acc.set(
      numéroLigne ? `Ligne ${numéroLigne.toString()}` : index.toString(),
      `${valeurInvalide ? `${valeurInvalide} - ` : ''}${raison}`,
    );
    return acc;
  }, new Map<string, string>());
};
