const docx = require("docx");
const { Packer } = docx.default || docx;

export const downloadDocx = async (doc, filename) => {
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
