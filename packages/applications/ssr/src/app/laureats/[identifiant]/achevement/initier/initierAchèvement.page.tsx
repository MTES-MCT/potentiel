import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { InitierAchèvementForm, type InitierAchèvementFormProps } from './InitierAchèvement.form';

export type InitierAchèvementPageProps = InitierAchèvementFormProps;

export const InitierAchèvementPage: FC<InitierAchèvementPageProps> = ({ identifiantProjet }) => (
  <>
    <Heading1>Initier l'achèvement du projet</Heading1>
    <div className="flex flex-col gap-4">
      <p>
        Initier l'achèvement indique à votre cocontractant que{' '}
        <span className="font-semibold">votre projet est prêt à être achevé</span>. Les informations
        de votre projet présentes sur Potentiel (producteur, puissance, raccordement, localisation…)
        lui seront alors mises à disposition afin qu'il puisse les associer à votre dossier et nous
        transmettre la date d'achèvement.
      </p>
      <p>
        Avant de continuer,{' '}
        <span className="font-semibold">vérifiez que ces informations sont à jour</span> : des
        données inexactes peuvent empêcher votre cocontractant de retrouver votre dossier et
        retarder l'achèvement.
      </p>
      <p>
        Une fois l'achèvement initié, vous ne{' '}
        <span className="font-semibold">pourrez pas le faire une seconde fois</span>. Votre projet
        reste actif jusqu'à ce que le cocontractant transmette la date d'achèvement.
      </p>
    </div>
    <InitierAchèvementForm identifiantProjet={identifiantProjet} />
  </>
);
