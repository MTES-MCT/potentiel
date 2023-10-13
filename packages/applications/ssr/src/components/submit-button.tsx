'use client';

//@ts-ignore
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Envoyer
    </button>
  );
}
