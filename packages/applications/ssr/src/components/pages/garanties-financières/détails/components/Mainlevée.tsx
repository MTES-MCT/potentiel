import { Heading2 } from '@/components/atoms/headings';
import { CallOut } from '@/components/atoms/CallOut';

import { MainlevéeEnCours, MainlevéeEnCoursProps } from './MainlevéeEnCours';
import {
  HistoriqueMainlevéeRejetée,
  HistoriqueMainlevéeRejetéeProps,
} from './HistoriqueMainlevéeRejetée';

type Props = {
  mainlevéeEnCours?: MainlevéeEnCoursProps['mainlevéeEnCours'];
  historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée'];
  identifiantProjet: string;
};

export const Mainlevée = ({ mainlevéeEnCours, historiqueMainlevée, identifiantProjet }: Props) => (
  <CallOut
    className="flex-1"
    colorVariant={mainlevéeEnCours?.statut === 'accordé' ? 'success' : 'warning'}
    content={
      <div className="flex flex-col">
        <Heading2>Mainlevée des garanties financières</Heading2>
        <div className="flex">
          {mainlevéeEnCours && (
            <MainlevéeEnCours
              identifiantProjet={identifiantProjet}
              mainlevéeEnCours={mainlevéeEnCours}
            />
          )}
          {historiqueMainlevée && historiqueMainlevée.historique.length && (
            <HistoriqueMainlevéeRejetée
              historiqueMainlevée={historiqueMainlevée}
              identifiantProjet={identifiantProjet}
            />
          )}
        </div>
      </div>
    }
  />
);
