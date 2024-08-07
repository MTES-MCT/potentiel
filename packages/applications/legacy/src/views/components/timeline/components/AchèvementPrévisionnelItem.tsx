import { Link } from '../..';
import React from 'react';
import { ContentArea, ItemDate, ItemTitle, NextUpIcon } from '.';
import { AchèvementPrévisionnelItemProps } from '../helpers/extractAchèvementPrévisionneltemProps';
export const AchèvementPrévisionnelItem = ({
  date,
  covidDelay,
  délaiCDC2022Appliqué,
}: AchèvementPrévisionnelItemProps) => {
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        {date && <ItemDate date={date} />}
        <ItemTitle title="Date d'achèvement prévisionnelle" />
        {covidDelay && (
          <p className="p-0 mb-0 mt-3">
            Ce projet bénéficie d'une prolongation de délai d'achèvement ou de mise en service
            compte tenu de la crise liée au coronavirus (covid-19){' '}
            <Link
              aria-label={`Voir les critères d'attribution de la prolongation de délai d'achèvement ou de mise en service
            compte tenu de la crise liée au coronavirus (covid-19)`}
              href="https://www.ecologie.gouv.fr/sites/default/files/2004%20-%20SR%20-%20Note%20EDF%20OA%20D%C3%A9finition%20des%20d%C3%A9lais%20COVID%202019_v5.pdf"
              download
            >
              (critères d'attribution)
            </Link>
            .
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
