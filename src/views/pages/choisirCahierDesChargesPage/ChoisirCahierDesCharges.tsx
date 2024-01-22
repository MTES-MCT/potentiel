import React from 'react';
import { ChoisirCahierDesChargesFormulaire, Heading1, LegacyPageTemplate } from '../../components';
import { ProjectDataForChoisirCDCPage } from '../../../modules/project';
import { Request } from 'express';
import { hydrateOnClient } from '../../helpers';

type ChoisirCahierDesChargesProps = {
  request: Request;
  projet: ProjectDataForChoisirCDCPage;
};

export const ChoisirCahierDesCharges = ({ projet, request }: ChoisirCahierDesChargesProps) => {
  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <Heading1 className="mb-10">Cahier des charges</Heading1>
      <ChoisirCahierDesChargesFormulaire
        projet={projet}
        cahiersDesChargesUrl={projet.appelOffre.cahiersDesChargesUrl}
      />
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ChoisirCahierDesCharges);
