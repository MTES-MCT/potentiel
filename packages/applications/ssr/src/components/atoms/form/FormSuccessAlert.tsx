import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

type Props = {
  message: string;
  linkUrl: string | null;
  linkUrlLabel: string | null;
};

export const FormSuccessAlert: FC<Props> = ({ message, linkUrl, linkUrlLabel }) => {
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
    params.delete('linkUrl');
    params.delete('linkUrlLabel');

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
        description={
          <>
            <p>{message}</p>
            {linkUrl && linkUrlLabel && (
              <Link target="_blank" rel="noopener noreferrer" href={linkUrl}>
                {linkUrlLabel}
              </Link>
            )}
          </>
        }
        className="min-h-10"
      />
    </div>
  );
};
