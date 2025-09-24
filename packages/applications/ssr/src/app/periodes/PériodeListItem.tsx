'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Icon, IconProps } from '@/components/atoms/Icon';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { notifierPériodeAction } from './notifierPériode.action';

export type PériodeListItemProps = {
  identifiantPériode: string;

  appelOffre: string;
  période: string;

  peutÊtreNotifiée: boolean;

  notifiéLe?: Iso8601DateTime;
  notifiéPar?: string;
  stats: {
    tous: {
      éliminés: number;
      lauréats: number;
      total: number;
    };
    /**
     * Représente les candidats restants à notifier,
     * APRES notification de la période
     * */
    restants?: {
      éliminés: number;
      lauréats: number;
      total: number;
    };
  };
};

export const PériodeListItem: FC<PériodeListItemProps> = ({
  identifiantPériode,
  appelOffre,
  période,
  peutÊtreNotifiée,
  notifiéLe,
  notifiéPar,
  stats,
}) => (
  <div className={`relative ${peutÊtreNotifiée ? 'pb-16' : ''} md:pb-0 flex flex-1 flex-col gap-6`}>
    <div className={`flex flex-col ${peutÊtreNotifiée ? '' : 'gap-2'}`}>
      <div className="flex items-center">
        <h2 className="leading-5">
          Période <span className="font-bold">{période}</span> de l'appel d'offres{' '}
          <span className="font-bold">{appelOffre}</span>
        </h2>

        {peutÊtreNotifiée && (
          <div className="absolute bottom-0 md:relative md:flex items-center ml-auto gap-4">
            <NotifyButton
              identifiantPériode={identifiantPériode}
              appelOffre={appelOffre}
              période={période}
              nouveauxCandidatsANotifier={stats.restants?.total}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Badge severity={stats.restants ? 'warning' : notifiéLe ? 'success' : 'info'}>
          {stats.restants ? 'Partiellement Notifiée' : notifiéLe ? 'Notifiée' : 'À notifier'}
        </Badge>
      </div>
    </div>

    <div className="flex flex-col gap-4 mb-4 md:mb-0 md:flex-row md:items-center">
      <div className="flex md:flex-1 flex-col gap-1 text-sm">
        {notifiéLe && (
          <div className="flex items-center gap-2">
            <Icon id="fr-icon-calendar-line" title="Notifié le" size="sm" />
            <span className="italic">
              Notifiée le <FormattedDate date={notifiéLe} />
            </span>
          </div>
        )}

        {notifiéPar && (
          <div className="flex  items-center gap-2">
            <Icon id="fr-icon-account-line" title="Notifié par" size="sm" />
            {notifiéPar}
          </div>
        )}
      </div>

      <Stat
        iconProps={{
          id: 'fr-icon-close-circle-fill',
          className: 'text-dsfr-redMarianne-main472-default',
          title: 'Total des éliminés',
        }}
        appelOffre={appelOffre}
        période={période}
        nombreTotal={stats.tous.éliminés}
        nombreRestant={stats.restants?.éliminés}
        statut="éliminé"
        label="éliminé"
      />
      <Stat
        iconProps={{
          id: 'fr-icon-checkbox-circle-fill',
          className: 'text-dsfr-greenEmeraude-main632-default',
          title: 'Total des classés',
        }}
        appelOffre={appelOffre}
        période={période}
        nombreTotal={stats.tous.lauréats}
        nombreRestant={stats.restants?.lauréats}
        statut="classé"
        label="lauréat"
      />

      <Stat
        iconProps={{ id: 'fr-icon-file-text-fill', title: 'Total des candidatures' }}
        appelOffre={appelOffre}
        période={période}
        nombreTotal={stats.tous.total}
        nombreRestant={stats.restants?.total}
        label="candidat"
      />
    </div>
  </div>
);

type NotifyButtonProps = {
  identifiantPériode: string;
  appelOffre: string;
  période: string;
  nouveauxCandidatsANotifier?: number;
};

const NotifyButton: FC<NotifyButtonProps> = ({
  identifiantPériode,
  appelOffre,
  période,
  nouveauxCandidatsANotifier,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        {nouveauxCandidatsANotifier
          ? nouveauxCandidatsANotifier === 1
            ? `Notifier le candidat restant`
            : `Notifier les ${nouveauxCandidatsANotifier} candidats restants`
          : 'Notifier'}
      </Button>

      <ModalWithForm
        id={`notifier-période-${identifiantPériode}`}
        title="Notifier la période"
        cancelButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'notifier-periode-form',
          action: notifierPériodeAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir notifier la période {période} de l'appel d'offres{' '}
                {appelOffre} ?
              </p>
              <input type={'hidden'} value={appelOffre} name="appelOffre" />
              <input type={'hidden'} value={période} name="periode" />
            </>
          ),
        }}
      />
    </>
  );
};

type StatProps = {
  iconProps: IconProps;
  nombreTotal: number;
  nombreRestant?: number;
  statut?: 'éliminé' | 'classé';
  appelOffre: string;
  période: string;
  label: string;
};

const Stat: FC<StatProps> = ({
  appelOffre,
  période,
  iconProps,
  nombreTotal,
  nombreRestant,
  statut,
  label,
}) => {
  return (
    <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
      <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
        <Icon
          id={iconProps.id}
          className={iconProps.className}
          size={iconProps.size}
          title={iconProps.title}
        />

        <div className="flex gap-2 lg:flex-col items-center">
          <Link
            href={Routes.Candidature.lister({
              appelOffre,
              période,
              statut,
            })}
          >
            {formatStat(nombreTotal, label)}
          </Link>
          {nombreRestant !== undefined && nombreTotal !== 0 && (
            <Link
              href={Routes.Candidature.lister({
                appelOffre,
                période,
                statut,
                estNotifié: false,
              })}
              className="italic"
            >
              (dont {nombreRestant} à notifier)
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const formatStat = (n: number, text: string) => `${n} ${text}${n > 1 ? 's' : ''}`;
