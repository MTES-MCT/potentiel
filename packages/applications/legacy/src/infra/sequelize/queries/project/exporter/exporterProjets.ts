import { ExporterProjets, FiltreListeProjets } from '../../../../../modules/project';
import { exporterProjetsPourDGEC } from './requêtes/exporterProjetsPourDGEC';
import { exporterProjetsPourCRE } from './requêtes/exporterProjetsPourCRE';
import { exporterProjetsPourCaisseDesDépôts } from './requêtes/exporterProjetsPourCaisseDesDépôts';
import { exporterProjetsPourPorteurDeProjet } from './requêtes/exporterProjetsPourPorteurDeProjet';
import { exporterProjetsPourDREAL } from './requêtes/exporterProjetsPourDREAL';
import { exporterProjetsPourADEME } from './requêtes/exporterProjetsPourADEME';
import { exporterProjetsPourAcheteurObligé } from './requêtes/exporterProjetsPourAcheteurObligé';
import { User } from '../../../../../entities';
import { errAsync } from 'neverthrow';
import { UnauthorizedError } from '../../../../../modules/shared';

type ExporterProjetsProps = {
  user: User;
  filtres?: FiltreListeProjets;
};

export const exporterProjets: ExporterProjets = ({ user, filtres }: ExporterProjetsProps) => {
  switch (user.role) {
    case 'admin':
    case 'dgec-validateur':
      return exporterProjetsPourDGEC({ filtres });
    case 'cre':
      return exporterProjetsPourCRE({ filtres });
    case 'caisse-des-dépôts':
      return exporterProjetsPourCaisseDesDépôts({ filtres });
    case 'porteur-projet':
      return exporterProjetsPourPorteurDeProjet({ user, filtres });
    case 'dreal':
      return exporterProjetsPourDREAL({ userId: user.id, filtres });
    case 'ademe':
      return exporterProjetsPourADEME({ filtres });
    case 'acheteur-obligé':
      return exporterProjetsPourAcheteurObligé({ filtres });
    default:
      return errAsync(new UnauthorizedError());
  }
};
