'use client';

import { CustomErrorPage } from '@/components/pages/custom-error/CustomError.page';

export default function Unauthorized() {
  return (
    <CustomErrorPage statusCode="403" type="InvalidOperationError" message="Utilisateur inconnu" />
  );
}
