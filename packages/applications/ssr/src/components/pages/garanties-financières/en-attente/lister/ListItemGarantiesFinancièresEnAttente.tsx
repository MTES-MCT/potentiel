import { FC } from 'react';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Link from 'next/link';
import Download from '@codegouvfr/react-dsfr/Download';

import { Routes } from '@potentiel-applications/routes';

import { formatDateForText } from '@/utils/formatDateForText';
import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { relancerGarantiesFinancièresEnAttenteAction } from './relancerGarantiesFinancièresEnAttente.action';

export type ListItemGarantiesFinancièresEnAttenteProps = {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  statut: 'en-attente';
  dateÉchéance?: string;
  misÀJourLe: string;
  régionProjet: string;
  action: 'relancer' | 'télécharger--modèle-mise-en-demeure';
};

export const ListItemGarantiesFinancièresEnAttente: FC<
  ListItemGarantiesFinancièresEnAttenteProps
> = ({
  identifiantProjet,
  nomProjet,
  appelOffre,
  période,
  famille,
  statut,
  misÀJourLe,
  régionProjet,
  action,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          Garanties financières du projet{' '}
          <span className="font-bold mr-3">
            <Link href={Routes.Projet.details(identifiantProjet)}>{nomProjet}</Link>
          </span>{' '}
          <Badge noIcon severity={'error'} small={true}>
            {statut}
          </Badge>
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
        {action === 'télécharger--modèle-mise-en-demeure' && (
          <Download
            linkProps={{
              href: Routes.GarantiesFinancières.téléchargerModèleMiseEnDemeure(identifiantProjet),
            }}
            details="docx"
            label="Télécharger le modèle de mise en demeure"
            className="my-4"
          />
        )}
      </div>
    </div>

    <div className="flex flex-col gap-4 justify-between mt-4 md:mt-0">
      <p className="italic text-xs">dernière mise à jour le {formatDateForText(misÀJourLe)}</p>
      {action === 'relancer' && (
        <ButtonWithFormInModal
          name="Relancer"
          description="Relancer le(s) porteur(s) pour obtenir les garanties financières"
          form={{
            action: relancerGarantiesFinancièresEnAttenteAction,
            method: 'post',
            encType: 'multipart/form-data',
            id: 'relancer-garanties-financieres-en-attente-form',
            onSuccess: () => {
              console.log('DONE');
            },
            children: <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />,
          }}
        />
      )}
    </div>
  </>
);
