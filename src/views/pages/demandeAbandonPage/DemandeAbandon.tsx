import React from 'react';
import { Request } from 'express';
import { DemandeAbandonPageDTO } from '../../../modules/modificationRequest';
import { hydrateOnClient } from '../../helpers';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';

import {
  DemandeAbandonEnLectureSeule,
  DemandeAbandonPourAdmin,
  DemandeAbandonPourPorteur,
} from './components';

type DemandeAbandonProps = {
  request: Request;
  demandeAbandon: DemandeAbandonPageDTO;
};

export const DemandeAbandon = ({ request, demandeAbandon }: DemandeAbandonProps) => {
  const utilisateur = request.user as UtilisateurReadModel;
  const { error, success } = request.query as any;

  switch (utilisateur.role) {
    case 'admin':
    case 'dgec-validateur':
      return (
        <DemandeAbandonPourAdmin
          demandeAbandon={demandeAbandon}
          utilisateur={utilisateur}
          success={success}
          error={error}
        />
      );
    case 'porteur-projet':
      return (
        <DemandeAbandonPourPorteur
          demandeAbandon={demandeAbandon}
          utilisateur={utilisateur}
          success={success}
          error={error}
        />
      );
    case 'dreal':
    case 'acheteur-obligé':
    case 'cre':
      return (
        <DemandeAbandonEnLectureSeule
          demandeAbandon={demandeAbandon}
          utilisateur={utilisateur}
          success={success}
          error={error}
        />
      );
    default:
      return <></>;
  }
};

hydrateOnClient(DemandeAbandon);
