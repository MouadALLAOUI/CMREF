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
  kpiSection: { marginBottom: 12, padding: 8, backgroundColor: '#f0fdf4', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#10b981' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  kpiLabel: { fontSize: 9, color: '#374151' },
  kpiValue: { fontSize: 9, fontWeight: 'bold' },
  footerBox: { marginTop: 10, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4, borderTopWidth: 1, borderTopColor: '#d1d5db' },
});

const RembGlobalePdf = ({ title, rows, kpis, labelField, seasonLabel }) => (
  <Document>
    <PdfPageLayout>
      <Text style={styles.title}>{title}</Text>
      {seasonLabel && <Text style={styles.subtitle}>{seasonLabel}</Text>}

      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Crédit total :</Text>
          <Text style={[styles.kpiValue, { color: '#2563eb' }]}>{currencyFormat(kpis.credit)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Avance totale :</Text>
          <Text style={[styles.kpiValue, { color: '#059669' }]}>{currencyFormat(kpis.avance)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Reste :</Text>
          <Text style={[styles.kpiValue, { color: '#dc2626' }]}>{currencyFormat(kpis.reste)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Recouvrement :</Text>
          <Text style={[styles.kpiValue, { color: '#d97706' }]}>{kpis.recouvrement.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <View style={{ width: '25%' }}><Text style={styles.tableCellHeader}>{labelField === 'rep' ? 'Représentant' : 'Fournisseur'}</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Crédit (DH)</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Avance (DH)</Text></View>
          <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>Reste (DH)</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>Opérations</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Mode</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>Statut</Text></View>
        </View>
        {rows.map((row, idx) => (
          <View key={idx} style={styles.tableRow} wrap={false}>
            <View style={{ width: '25%' }}><Text style={styles.tableCell}>{labelField === 'rep' ? row.rep : row.fournisseur}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>{currencyFormat(kpis.credit / rows.length)}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>{currencyFormat(row.totalRemb)}</Text></View>
            <View style={{ width: '18%' }}><Text style={styles.tableCell}>—</Text></View>
            <View style={{ width: '10%' }}><Text style={styles.tableCell}>{row.operations}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.tableCell}>{row.mode}</Text></View>
            <View style={{ width: '10%' }}><Text style={styles.tableCell}>{row.status}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.footerBox}>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL CRÉDIT : {currencyFormat(kpis.credit)}</Text>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL AVANCE : {currencyFormat(kpis.avance)}</Text>
        <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL RESTE : {currencyFormat(kpis.reste)}</Text>
      </View>
    </PdfPageLayout>
  </Document>
);

export default RembGlobalePdf;
