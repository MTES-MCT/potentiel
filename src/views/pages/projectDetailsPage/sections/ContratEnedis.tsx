import React from 'react';
import { ProjectDataForProjectPage } from '@modules/project';
import { BuildingIcon, Heading5, Section } from '@components';

type ContratEnedisProps = {
  contrat: Exclude<ProjectDataForProjectPage['contratEnedis'], undefined>;
};

export const ContratEnedis = ({ contrat: { numero } }: ContratEnedisProps) => (
  <Section title="Contrat Enedis" icon={BuildingIcon}>
    <Item title="Numero de contrat" value={numero} />
  </Section>
);

type ItemProps = {
  title: string;
  value: string | undefined;
};
const Item = ({ title, value }: ItemProps) => {
  if (!value) return null;

  return (
    <div>
      <Heading5 className="m-0">{title}</Heading5>
      <div className="pt-1 pb-2">{value}</div>
    </div>
  );
};
