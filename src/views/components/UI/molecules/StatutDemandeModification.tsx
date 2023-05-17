import { ModificationRequestStatusDTO } from '@modules/modificationRequest';
import React, { ComponentProps } from 'react';

type StatutDemandeModificationProps = ComponentProps<'div'> & {
  statutDemande: ModificationRequestStatusDTO;
};

export const StatutDemandeModification = ({
  statutDemande,
  children,
  className = '',
  ...props
}: StatutDemandeModificationProps) => {
  const getColor = (statutDemande: ModificationRequestStatusDTO) => {
    switch (statutDemande) {
      case 'envoyée':
        return 'info-425-base';
      case 'rejetée':
      case 'annulée':
        return 'error-425-base';
      case 'information validée':
      case 'acceptée':
        return 'success-425-base';
      case 'demande confirmée':
      case 'en attente de confirmation':
      case 'en instruction':
        return 'warning-425-base';
    }
  };

  const couleur = getColor(statutDemande);

  return (
    <section
      className={`m-0 p-4 border border-solid border-${couleur} rounded-[3px] text-${couleur} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};
