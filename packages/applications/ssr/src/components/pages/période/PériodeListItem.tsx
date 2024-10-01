'use client';

import React, { FC, useState } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Icon } from '@/components/atoms/Icon';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { notifierPériodeAction } from './notifier/notifierPériode.action';

export type PériodeListItemProps = {
  identifiantPériode: string;

  appelOffre: string;
  période: string;

  peutÊtreNotifiée: boolean;

  notifiéLe?: Iso8601DateTime;
  notifiéPar?: string;

  totalÉliminés: number;
  totalLauréats: number;
  totalCandidatures: number;
  nouveauxCandidatsANotifier: number;
};

export const PériodeListItem: FC<PériodeListItemProps> = ({
  identifiantPériode,
  appelOffre,
  période,
  peutÊtreNotifiée,
  notifiéLe,
  notifiéPar,
  totalÉliminés,
  totalLauréats,
  totalCandidatures,
  nouveauxCandidatsANotifier,
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
              nouveauxCandidatsANotifier={nouveauxCandidatsANotifier}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Badge severity={nouveauxCandidatsANotifier ? 'warning' : notifiéLe ? 'success' : 'info'}>
          {nouveauxCandidatsANotifier
            ? 'Partiellement Notifiée'
            : notifiéLe
              ? 'Notifiée'
              : 'À notifier'}
        </Badge>
      </div>
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:items-center">
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

      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id="fr-icon-close-circle-fill"
            className="text-dsfr-redMarianne-main472-default"
            title="Total des éliminés"
          />
          <Link href={Routes.Candidature.lister({ appelOffre, période, statut: 'éliminé' })}>
            {totalÉliminés} éliminé{totalÉliminés > 1 ? 's' : ''}
          </Link>
        </div>
      </div>

      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id="fr-icon-checkbox-circle-fill"
            className="text-dsfr-greenEmeraude-main632-default"
            title="Total des classés"
          />
          <Link href={Routes.Candidature.lister({ appelOffre, période, statut: 'classé' })}>
            {totalLauréats} lauréat{totalLauréats > 1 ? 's' : ''}
          </Link>
        </div>
      </div>

      <Stat icon={<Icon id="fr-icon-file-text-fill" title="Total des candidatures" />}>
        <Link href={Routes.Candidature.lister({ appelOffre, période })}>
          {totalCandidatures} candidature{totalCandidatures > 1 ? 's' : ''}
        </Link>
      </Stat>
    </div>
  </div>
);

type NotifyButtonProps = {
  identifiantPériode: string;
  appelOffre: string;
  période: string;
  nouveauxCandidatsANotifier: number;
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
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'notifier-periode-form',
          action: notifierPériodeAction,
          method: 'POST',
          encType: 'multipart/form-data',
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

const Stat = ({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) => {
  return (
    <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
      <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
        {icon}
        <div className="lg:flex lg:flex-col items-center">{children}</div>
      </div>
    </div>
  );
};
