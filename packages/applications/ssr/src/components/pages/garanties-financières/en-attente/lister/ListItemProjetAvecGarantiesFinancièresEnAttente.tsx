import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

export type ListItemProjetAvecGarantiesFinancièresEnAttenteProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  régionProjet: string;
  motif: string;
  misÀJourLe: Iso8601DateTime;
  dateLimiteSoumission: Iso8601DateTime;
  afficherModèleMiseEnDemeure: boolean;
};

export const ListItemProjetAvecGarantiesFinancièresEnAttente: FC<
  ListItemProjetAvecGarantiesFinancièresEnAttenteProps
> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  régionProjet,
  misÀJourLe,
  motif,
  dateLimiteSoumission,
  afficherModèleMiseEnDemeure,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Projet <strong className="mr-3">{nomProjet}</strong>
        </h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 italic text-xs">
          <div>
            Appel d'offres : {appelOffre}
            <span className="hidden md:inline-block mr-2">,</span>
          </div>
          <div>Période : {période}</div>
          {famille && (
            <div>
              <span className="hidden md:inline-block mr-2">,</span>
              Famille : {famille}
            </div>
          )}
          {régionProjet && (
            <div>
              <span className="hidden md:inline-block mr-2">,</span>
              Région : {régionProjet}
            </div>
          )}
        </div>
        <div className="mt-3 text-sm">
          Motif : <strong>{motif}</strong>
        </div>
        <div className="text-sm">
          Date limite de soumission :{' '}
          <strong>
            <FormattedDate date={dateLimiteSoumission} />
          </strong>
        </div>
        {/* {afficherModèleMiseEnDemeure && ( */}
        <DownloadDocument
          className="mb-4"
          url={Routes.GarantiesFinancières.téléchargerModèleMiseEnDemeure(identifiantProjet)}
          format="docx"
          label="Télécharger un modèle de mise en demeure"
        />
        {/* )} */}
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-0">
      <p className="italic text-xs">
        Dernière mise à jour le <FormattedDate date={misÀJourLe} />
      </p>
      <Link
        href={Routes.Projet.details(identifiantProjet)}
        className="self-end mt-2"
        aria-label={`voir le détail du projet ${nomProjet}`}
      >
        voir le projet
      </Link>
    </div>
  </>
);
