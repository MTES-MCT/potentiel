import { DateMiseEnServiceDTO } from '@modules/frise';
import React from 'react';
import { ContentArea, ItemDate, ItemTitle, NextUpIcon } from '.';

type MeSProps = DateMiseEnServiceDTO;

export const MeSItem = (props: MeSProps) => {
  const { statut } = props;
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        {statut === 'renseignée' && <ItemDate date={props.date} />}
        <ItemTitle title="Mise en service" />
        {statut === 'non-renseignée' && <span>Date de mise en service à venir</span>}
      </ContentArea>
    </>
  );
};
