import { ValidationError } from 'yup';

const getNuméroLigne = (path: string | undefined) => {
  const extractLigne = path?.replace(/\D/g, '');
  if (!extractLigne) {
    return;
  }

  return Number(extractLigne) + 2;
};

type CsvError = {
  numéroLigne?: number;
  valeurInvalide?: string;
  raison: string;
};

export const mapCsvYupValidationErrorToCsvErrors = (error: ValidationError): Array<CsvError> => {
  return error.inner.reduce((csvErrors, err) => {
    const { path, params, errors } = err;
    const numéroLigne = getNuméroLigne(path);

    if (!errors?.length) {
      return csvErrors;
    }

    const valeurInvalide =
      typeof params?.originalValue === 'string' ? params.originalValue : undefined;

    const [raison] = errors;

    return [
      ...csvErrors,
      {
        numéroLigne,
        valeurInvalide,
        raison: raison,
      },
    ];
  }, []);
};
