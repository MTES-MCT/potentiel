import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { Email } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { CorrigerRéponseSignée } from '../../../mainlevée/corrigerRéponseSignée/CorrigerRéponseSignée.form';

import { MainlevéeEnCoursProps } from './MainlevéeEnCours';

export type MainlevéeEnCoursAccordProps = {
  accord: {
    date: Iso8601DateTime;
    par?: Email.RawType;
    courrierAccord: string;
  };
  identifiantProjet: string;
  actions: MainlevéeEnCoursProps['mainlevéeEnCours']['actions'];
};

export const MainlevéeEnCoursAccord: FC<MainlevéeEnCoursAccordProps> = ({
  accord,
  actions,
  identifiantProjet,
}) => (
  <div>
    <div>
      Mainlevée accordée le : <FormattedDate className="font-semibold" date={accord.date} /> par{' '}
      <span className="font-semibold">{accord.par}</span>
    </div>
    <div className="flex flex-col gap-1 justify-center">
      <DownloadDocument
        format="pdf"
        label="Télécharger la réponse signée"
        url={Routes.Document.télécharger(accord.courrierAccord)}
      />
      {actions.includes('modifier-courrier-réponse-mainlevée-gf') && (
        <CorrigerRéponseSignée
          identifiantProjet={identifiantProjet}
          courrierRéponseÀCorriger={accord.courrierAccord}
        />
      )}
    </div>
  </div>
);
