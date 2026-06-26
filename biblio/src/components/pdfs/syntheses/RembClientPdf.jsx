import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 8, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 10, marginBottom: 15, textAlign: 'center', color: '#6b7280' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 22, alignItems: 'center' },
  tableHeader: { backgroundColor: '#111827' },
  tableCellHeader: { color: '#ffffff', fontSize: 8, fontWeight: 'bold', padding: 4 },
  tableCell: { fontSize: 8, padding: 4, color: '#374151' },
  footerBox: { marginTop: 10, padding: 10, backgroundColor: '#f0fdf4', borderRadius: 4, alignSelf: 'flex-end', width: '50%' },
});

const RembClientPdf = ({ rows, totalMontant, repLabel }) => (
  <Document>
    <PdfPageLayout>
      <Text style={styles.title}>Remboursements Clients</Text>
      {repLabel && repLabel !== 'Tous' && <Text style={styles.subtitle}>Représentant : {repLabel}</Text>}

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <View style={{ width: '25%' }}><Text style={styles.tableCellHeader}>Client</Text></View>
          <View style={{ width: '25%' }}><Text style={styles.tableCellHeader}>Représentant</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Date</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Montant (DH)</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.tableCellHeader}>Banque</Text></View>
        </View>
        {rows.map((row, idx) => (
          <View key={idx} style={styles.tableRow} wrap={false}>
            <View style={{ width: '25%' }}><Text style={styles.tableCell}>{row.client?.raison_sociale || '—'}</Text></View>
            <View style={{ width: '25%' }}><Text style={styles.tableCell}>{row.representant?.nom || '—'}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.tableCell}>{row.date_payment || '—'}</Text></View>
            <View style={{ width: '15%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{currencyFormat(row.montant)}</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.tableCell}>{row.banque?.nom || row.banque_nom || '—'}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.footerBox}>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL : {currencyFormat(totalMontant)}</Text>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>NOMBRE : {rows.length} remboursement(s)</Text>
      </View>
    </PdfPageLayout>
  </Document>
);

export default RembClientPdf;
