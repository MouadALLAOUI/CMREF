import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat, schoolYearFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 20, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#064e3b' }, // Dark Green for Remb
  tableCol: { width: '25%', padding: 5 },
  tableCellHeader: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  tableCell: { fontSize: 9, color: '#374151' },
  footerBox: { marginTop: 10, padding: 10, backgroundColor: '#f0fdf4', borderRadius: 4, alignSelf: 'flex-end', width: '40%' }
});

const SyntheseRembPdf = ({ data, annee, total }) => (
  <Document>
    <PdfPageLayout orientation="portrait">
      <Text style={styles.title}>Synthèse des Remboursements - {annee === 'all' ? 'Toutes Années' : schoolYearFormat(annee)}</Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCellHeader}>Fournisseur</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Année</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Total Remboursé</Text></View>
        </View>

        {data.map((row, index) => (
          <View key={index} style={styles.tableRow} wrap={false}>
            <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCell}>{row.fournisseur}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{schoolYearFormat(row.annee)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{currencyFormat(row.totalRemb)}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.footerBox}>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL GÉNÉRAL : {currencyFormat(total)}</Text>
      </View>
    </PdfPageLayout>
  </Document>
);

export default SyntheseRembPdf;