import { Text } from '@react-pdf/renderer';
import React from 'react';

type ObjetProps = {
  text: string;
};

export const Objet = ({ text }: ObjetProps) => {
  return <Text style={{ fontWeight: 'bold', marginTop: 30 }}>Objet : {text}</Text>;
};
