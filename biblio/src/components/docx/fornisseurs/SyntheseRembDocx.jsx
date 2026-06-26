const { currencyFormat, schoolYearFormat } = require("../../../lib/utilities");
const docx = require("docx");
const docxModule = { ...docx, ...(docx.default || {}) };
const { Document, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle } = docxModule;

const border = {
  style: size: 1, color: "999999",
};

export const SyntheseRembDocx = ({ data, annee, total }) => {
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Fournisseur", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Année", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "Total Remboursé", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
      ],
    }),
    ...(data || []).map((row) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: row.fournisseur || "—" })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: row.annee ? schoolYearFormat(row.annee) : "—" })], alignment: AlignmentType.CENTER })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: currencyFormat(row.totalRemb) })], alignment: AlignmentType.RIGHT })] }),
        ],
      })
    ),
    new TableRow({
      children: [
        new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: "TOTAL GÉNÉRAL", bold: true })] })] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({})] }),
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: border, children: [new Paragraph({ children: [new TextRun({ text: currencyFormat(total), bold: true })], alignment: AlignmentType.RIGHT })] }),
      ],
    }),
  ];

  return new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: `Synthèse des Remboursements - ${annee === "all" ? "Toutes Années" : schoolYearFormat(annee)}`, bold: true, size: 28 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }),
      ],
    }],
  });
};
