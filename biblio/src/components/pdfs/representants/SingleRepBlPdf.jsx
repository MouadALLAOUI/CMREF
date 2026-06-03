import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { dateFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 18, marginBottom: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  infoSection: { marginBottom: 20, fontSize: 10, color: '#374151' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#111827' },
  tableCol: { width: '25%', padding: 5 },
  tableCellHeader: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  tableCell: { fontSize: 9 },
  totalSection: { marginTop: 15, alignSelf: 'flex-end', width: '30%', borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5 }
});

const SingleRepBlPdf = ({ blData }) => (
  <Document>
    <PdfPageLayout>
      <Text style={styles.title}>Bon de Livraison N° {blData.bl_number}</Text>

      <View style={styles.infoSection}>
        <Text>Représentant : {blData.representant}</Text>
        <Text>Date d'émission : {dateFormat(blData.date)}</Text>
        {blData.type && <Text>Type : {blData.type}</Text>}
        {blData.mode_envoi && <Text>Mode d'envoi : {blData.mode_envoi}</Text>}
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>ID</Text></View>
          <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCellHeader}>Désignation</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Code</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Qté</Text></View>
        </View>

        {(blData.rawItems || blData.items || []).map((item, idx) => (
          <View key={idx} style={styles.tableRow} wrap={false}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{idx + 1}</Text></View>
            <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCell}>{item.livre?.titre}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.livre?.code}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantite}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.totalSection}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'right' }}>
          Total articles : {(blData.rawItems || blData.items || []).reduce((sum, i) => sum + (parseInt(i.quantite) || 0), 0)}
        </Text>
      </View>
    </PdfPageLayout>
  </Document>
);

export default SingleRepBlPdf;
