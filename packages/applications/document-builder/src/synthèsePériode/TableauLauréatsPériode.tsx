import { StyleSheet, Text, View } from '@react-pdf/renderer';
import type { FC } from 'react';

export type TableauLauréatPériodeProps = {
  lauréats: {
    nom: string;
    nomProjet: string;
    puissance: string;
    commune: string;
    département: string;
    région: string;
    unitéPuissance: string;
  }[];
  key: string;
  indexPage: number;
  pagesLength: number;
};

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: '#000',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#eee',
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 4,
    fontSize: 9,
  },

  laureat: { flex: 2 },
  projet: { flex: 3 },
  puissance: { flex: 2 },
  commune: { flex: 2 },
  departement: { flex: 2 },
  region: { flex: 2 },
});

const manageWrapWithHyphen = (text: string) => {
  const index = text.indexOf('-');
  if (index === -1 || (index < 8 && text.length < 14)) {
    return <Text>{text}</Text>;
  }
  return (
    <Text>
      {text.slice(0, index + 1)}
      {'\n'}
      {text.slice(index + 1)}
    </Text>
  );
};
export const TableauLauréatPériode: FC<TableauLauréatPériodeProps> = ({
  lauréats,
  key,
  indexPage,
  pagesLength,
}) => {
  return (
    <View key={key}>
      <Text style={{ marginTop: 1, marginBottom: 15, fontWeight: 'bold' }}>
        Données de candidature des lauréats avant désignation triées par région et département (
        {indexPage + 1}/{pagesLength}) :{' '}
      </Text>
      <View style={styles.table}>
        {/* En-tête */}
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.laureat]}>Lauréat</Text>
          <Text style={[styles.cell, styles.projet]}>Nom projet</Text>
          <Text style={[styles.cell, styles.puissance]}>Puissance</Text>
          <Text style={[styles.cell, styles.commune]}>Commune</Text>
          <Text style={[styles.cell, styles.departement]}>Département</Text>
          <Text style={[styles.cell, styles.region]}>Région</Text>
        </View>

        {/* Lignes */}
        {lauréats.map((lauréat) => (
          <View key={lauréat.nomProjet} style={styles.row}>
            <Text style={[styles.cell, styles.laureat]}>{manageWrapWithHyphen(lauréat.nom)}</Text>

            <Text style={[styles.cell, styles.projet]}>
              {manageWrapWithHyphen(lauréat.nomProjet)}
            </Text>

            <Text style={[styles.cell, styles.puissance]}>
              {lauréat.puissance} {lauréat.unitéPuissance}
            </Text>

            <Text style={[styles.cell, styles.commune]}>
              {manageWrapWithHyphen(lauréat.commune)}
            </Text>

            <Text style={[styles.cell, styles.departement]}>
              {manageWrapWithHyphen(lauréat.département)}
            </Text>

            <Text style={[styles.cell, styles.region]}>{manageWrapWithHyphen(lauréat.région)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
