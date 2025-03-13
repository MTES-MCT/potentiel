'use client';

import { useSearchParams } from 'next/navigation';

import {
  CustomErrorPage,
  CustomErrorProps,
  ErrorType,
} from '@/components/pages/custom-error/CustomError.page';

export default function Unauthorized() {
  const params = useSearchParams();
  const error = getError(params.get('error') ?? '');
  return (
    <CustomErrorPage statusCode={error.statusCode} type={error.type} message={error.message} />
  );
}

const getError = (
  error: string,
): { type: ErrorType; message: string; statusCode: CustomErrorProps['statusCode'] } => {
  switch (error) {
    case 'Verification':
      return {
        statusCode: '403',
        type: 'InvalidOperationError',
        message: 'La vérification du lien de connexion à échouée',
      };

    case 'AccessDenied':
      return {
        statusCode: '403',
        type: 'InvalidOperationError',
        message: 'Une erreur est survenue. Si le problème persiste vous pouvez nous contacter',
      };

    default:
      return {
        statusCode: '500',
        type: 'ServerError',
        message: 'Une erreur inattendue est survenue',
      };
  }
};
