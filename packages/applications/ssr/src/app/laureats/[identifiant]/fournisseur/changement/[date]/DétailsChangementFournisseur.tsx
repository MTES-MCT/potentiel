import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { DétailsChangement } from '@/components/organisms/demande/DétailsChangement';

import { ListeFournisseurs } from '../ListeFournisseurs';
import { AlerteChangementÉvaluationCarbone } from '../AlerteChangementÉvaluationCarbone';

export type DétailsChangementFournisseurProps = {
  changement: PlainType<Lauréat.Fournisseur.ConsulterChangementFournisseurReadModel['changement']>;
  évaluationCarboneSimplifiéeInitiale: number;
  technologie: AppelOffre.Technologie;
};

export const DétailsChangementFournisseur: FC<DétailsChangementFournisseurProps> = ({
  changement,
  évaluationCarboneSimplifiéeInitiale,
  technologie,
}) => {
  return (
    <DétailsChangement
      domaineLabel="fournisseurs"
      changement={changement}
      détailsSpécifiques={
        <DétailsFournisseursEtÉvaluationCarbonesSimplifiée
          changement={changement}
          évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
          technologie={technologie}
        />
      }
    />
  );
};

const DétailsFournisseursEtÉvaluationCarbonesSimplifiée = ({
  changement,
  technologie,
  évaluationCarboneSimplifiéeInitiale,
}: DétailsChangementFournisseurProps) => (
  <>
    {changement.évaluationCarboneSimplifiée !== undefined && (
      <>
        <div className="flex gap-2">
          <div className="font-semibold whitespace-nowrap">Évaluation carbone simplifiée :</div>
          <div>{changement.évaluationCarboneSimplifiée} kg eq CO2/kWc</div>
        </div>
        <AlerteChangementÉvaluationCarbone
          nouvelleÉvaluationCarbone={changement.évaluationCarboneSimplifiée}
          évaluationCarboneInitiale={évaluationCarboneSimplifiéeInitiale}
          technologie={technologie}
        />
      </>
    )}
    {changement.fournisseurs && (
      <div className="flex flex-col gap-2">
        <div className="font-semibold whitespace-nowrap">Fournisseurs :</div>
        <div className="flex flex-col gap-2">
          <ListeFournisseurs fournisseurs={changement.fournisseurs} />
        </div>
      </div>
    )}
  </>
);
