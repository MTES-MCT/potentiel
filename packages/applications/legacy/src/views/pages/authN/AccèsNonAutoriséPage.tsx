import React from 'react';
import { Heading1, LegacyPageTemplate } from '../../components';
import { Request } from 'express';

type AccèsNonAutoriséProps = {
  request: Request;
  fonctionnalité: string;
};

export const AccèsNonAutorisé = ({ request, fonctionnalité }: AccèsNonAutoriséProps) => (
  <LegacyPageTemplate {...request}>
    <Heading1>Accès non autorisé</Heading1>
    <p className="mt-0 text-sm">Erreur 403</p>
    <p>
      Votre compte ne vous permet pas de <span className="lowercase">{fonctionnalité}</span>.
    </p>
  </LegacyPageTemplate>
);
