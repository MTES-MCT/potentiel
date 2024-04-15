import { fr } from '@codegouvfr/react-dsfr';
import { FC } from 'react';

export type SpinnerProps = {
  className?: string;
  size: 'small' | 'medium' | 'large';
};

export const Spinner: FC<SpinnerProps> = ({ className, size }) => {
  const sizeClass = (size: SpinnerProps['size']) => {
    switch (size) {
      case 'small':
        return 'w-6 h-6';
      case 'medium':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
    }
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite ${sizeClass(
        size,
      )} ${className || ''}`}
      role="status"
      style={{
        color: fr.colors.decisions.background.active.blueFrance.default,
      }}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
