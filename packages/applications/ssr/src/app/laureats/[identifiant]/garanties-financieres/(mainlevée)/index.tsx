import { Heading2 } from '@/components/atoms/headings';
import { CallOut } from '@/components/atoms/CallOut';

import {
  HistoriqueMainlevéeRejetée,
  HistoriqueMainlevéeRejetéeProps,
} from './(historique-main-levée-rejetée)/HistoriqueMainlevéeRejetée';
import { MainlevéeEnCours, MainlevéeEnCoursProps } from './MainlevéeEnCours';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

type Props = {
  mainlevéeEnCours: PlainType<Lauréat.GarantiesFinancières.ConsulterMainlevéeEnCoursReadModel>;
  // historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée'];
  identifiantProjet: string;
};
// TODO on peut supprimer a priori, faut voir comment on gère l'historique des mainlevées rejetées

export const Mainlevée: React.FC<Props> = ({
  mainlevéeEnCours,
  // historiqueMainlevée,
}: Props) => (
  <CallOut
    className="flex-1"
    colorVariant={mainlevéeEnCours.statut.statut === 'accordé' ? 'success' : 'info'}
    content={
      <div className="flex flex-col">
        <Heading2>Mainlevée des garanties financières</Heading2>
        <div className="flex">
          {/* {mainlevéeEnCours && <MainlevéeEnCours mainlevéeEnCours={mainlevéeEnCours} />} */}
          {/* {historiqueMainlevée && historiqueMainlevée.historique.length && (
            <HistoriqueMainlevéeRejetée
              historiqueMainlevée={historiqueMainlevée}
              identifiantProjet={identifiantProjet}
            />
          )} */}
        </div>
      </div>
    }
  />
);
