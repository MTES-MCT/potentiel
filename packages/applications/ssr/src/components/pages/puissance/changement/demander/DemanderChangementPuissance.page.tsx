import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderChangementPuissanceForm } from './DemanderChangementPuissance.form';

export type DemanderChangementPuissancePageProps = PlainType<
  Lauréat.Puissance.ConsulterPuissanceReadModel & {
    appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
    période: AppelOffre.Periode;
    technologie: Candidature.TypeTechnologie.RawType;
    famille?: AppelOffre.Famille;
    cahierDesCharges: PlainType<Lauréat.ConsulterCahierDesChargesChoisiReadModel>;
    note: number;
    unitéPuissance: string;
    puissanceInitiale: number;
  }
>;

export const DemanderChangementPuissancePage: FC<DemanderChangementPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  appelOffre,
  période,
  technologie,
  famille,
  cahierDesCharges,
  note,
  unitéPuissance,
  puissanceInitiale,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer de puissance</Heading1>
    <DemanderChangementPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      appelOffre={appelOffre}
      période={période}
      technologie={technologie}
      famille={famille}
      cahierDesCharges={cahierDesCharges}
      note={note}
      unitéPuissance={unitéPuissance}
      puissanceInitiale={puissanceInitiale}
    />
  </PageTemplate>
);
