const { currencyFormat } = require("../../../lib/utilities");
const docx = require("docx");
const docxModule = { ...docx, ...(docx.default || {}) };
const { Document, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle } = docxModule;

const border = {
  style: "single", size: 1, color: "999999",
};

export const SyntheseRepRembDocx = ({ data, kpis }) => {
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Représentant", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Nb Remb.", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Total Remboursé", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Dernier Paiement", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
      ],
    }),
    ...(data || []).map((row) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: row.rep || "—" })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: String(row.nbRemb) })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: currencyFormat(row.totalRemb) })], alignment: AlignmentType.RIGHT })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: row.lastUpdate || "—" })], alignment: AlignmentType.CENTER })] }),
        ],
      })
    ),
    new TableRow({
      children: [
        new TableCell({ width: { size: 40, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "TOTAL GÉNÉRAL", bold: true })] })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: String(kpis?.operations || 0), bold: true })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: currencyFormat(kpis?.total || 0), bold: true })], alignment: AlignmentType.RIGHT })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({})] }),
      ],
    }),
  ];

  return new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: "Synthèse des Remboursements (Représentants)", bold: true, size: 28 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }),
      ],
    }],
  });
};
