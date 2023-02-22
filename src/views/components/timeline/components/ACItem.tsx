import { Link } from '@components';
import React from 'react';
import { ContentArea, ItemDate, ItemTitle, NextUpIcon } from '.';
import { ACItemProps } from '../helpers';
export const ACItem = ({ date, covidDelay, délaiCDC2022Appliqué }: ACItemProps) => {
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        {date && <ItemDate date={date} />}
        <ItemTitle title="Attestation de conformité" />
        <span aria-disabled className="disabled-action">
          Transmettre l'attestation (fonctionnalité bientôt disponible sur Potentiel)
        </span>
        {covidDelay && (
          <p className="p-0 mb-0 mt-3">
            Ce projet bénéficie d'une prolongation de délai d'achèvement ou de mise en service
            compte tenu de la crise liée au coronavirus (covid-19) (
            <Link
              href="https://www.ecologie.gouv.fr/sites/default/files/2004%20-%20SR%20-%20Note%20EDF%20OA%20D%C3%A9finition%20des%20d%C3%A9lais%20COVID%202019_v5.pdf"
              download
            >
              critères d'attribution
            </Link>
            ).
          </p>
        )}
        {délaiCDC2022Appliqué && (
          <p className="p-0 mb-0 mt-3">
            Ce projet bénéficie d'une prolongation de délai d'achèvement de 18 mois conformément au
            cahier des charges modifié rétroactivement et publié le 30/08/2022.
          </p>
        )}
      </ContentArea>
    </>
  );
};
