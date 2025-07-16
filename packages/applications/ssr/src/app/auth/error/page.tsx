'use client';

import { useSearchParams } from 'next/navigation';

import { CustomErrorPage, CustomErrorProps, ErrorType } from '@/app/error/CustomError.page';

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
    case 'Forbidden':
      return {
        statusCode: '403',
        type: 'InvalidOperationError',
        message: `Vous n'avez pas accès à l'application`,
      };
    case 'Verification':
    case 'AccessDenied':
      return {
        statusCode: '403',
        type: 'InvalidOperationError',
        message:
          'La vérification du lien de connexion à échouée. Si le problème persiste vous pouvez nous contacter',
      };

    default:
      return {
        statusCode: '500',
        type: 'ServerError',
        message: 'Une erreur inattendue est survenue',
      };
  }
};
