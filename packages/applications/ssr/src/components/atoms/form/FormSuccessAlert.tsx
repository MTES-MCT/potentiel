import Alert from '@codegouvfr/react-dsfr/Alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

type Props = {
  message: string;
};

export const FormSuccessAlert: FC<Props> = ({ message }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }, []);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleRemoveQueryParam = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('success');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className="mb-4">
      <Alert
        small
        closable
        severity="success"
        onClose={handleRemoveQueryParam}
        description={<p>{message}</p>}
      />
    </div>
  );
};
