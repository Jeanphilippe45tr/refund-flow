import jsPDF from 'jspdf';

export interface InvoiceFee {
  label: string;
  amount: number;
}

export interface InvoiceData {
  invoice_number: string;
  issued_at: string;
  status: string;
  company_name: string;
  company_website?: string | null;
  logo_url?: string | null;
  signature_url?: string | null;
  signatory_name?: string | null;
  client_name: string;
  client_email: string;
  client_country?: string | null;
  refund_amount: number;
  fees: InvoiceFee[];
  total_fees: number;
  currency: string;
  notes?: string | null;
}

const loadImage = (url: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

const imgToDataUrl = async (url: string): Promise<{ data: string; w: number; h: number } | null> => {
  const img = await loadImage(url);
  if (!img) return null;
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  try {
    return { data: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight };
  } catch {
    return null;
  }
};

export const generateInvoicePdf = async (inv: InvoiceData): Promise<Blob> => {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const margin = 15;
  let y = margin;

  // Brand colors
  const primary: [number, number, number] = [37, 99, 235];
  const dark: [number, number, number] = [15, 23, 42];
  const muted: [number, number, number] = [100, 116, 139];

  // Header band
  pdf.setFillColor(...primary);
  pdf.rect(0, 0, pageW, 8, 'F');
  y = 18;

  // Logo
  if (inv.logo_url) {
    const logo = await imgToDataUrl(inv.logo_url);
    if (logo) {
      const h = 16;
      const w = (logo.w / logo.h) * h;
      pdf.addImage(logo.data, 'PNG', margin, y, Math.min(w, 40), h);
    }
  }

  // Company info (right)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(...dark);
  pdf.text(inv.company_name, pageW - margin, y + 6, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(...muted);
  if (inv.company_website) pdf.text(inv.company_website, pageW - margin, y + 12, { align: 'right' });

  y += 28;

  // INVOICE title + number
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(...dark);
  pdf.text('INVOICE', margin, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(...muted);
  pdf.text(`# ${inv.invoice_number}`, margin, y + 6);

  // Status badge
  const statusText = inv.status.toUpperCase();
  pdf.setFillColor(34, 197, 94);
  const badgeW = pdf.getTextWidth(statusText) + 8;
  pdf.roundedRect(pageW - margin - badgeW, y - 5, badgeW, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(statusText, pageW - margin - badgeW / 2, y, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(...muted);
  pdf.text(`Issued: ${new Date(inv.issued_at).toLocaleDateString()}`, pageW - margin, y + 6, { align: 'right' });

  y += 18;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, pageW - margin, y);
  y += 8;

  // Bill To
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...muted);
  pdf.text('BILL TO', margin, y);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(...dark);
  pdf.text(inv.client_name, margin, y + 6);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(...muted);
  pdf.text(inv.client_email, margin, y + 12);
  if (inv.client_country) pdf.text(inv.client_country, margin, y + 17);

  y += 28;

  // Table header
  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, y, pageW - margin * 2, 9, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...dark);
  pdf.text('Description', margin + 3, y + 6);
  pdf.text('Amount', pageW - margin - 3, y + 6, { align: 'right' });
  y += 9;

  const fmt = (n: number) => `${inv.currency === 'EUR' ? '€' : '$'}${Number(n).toFixed(2)}`;

  // Rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  for (const fee of inv.fees) {
    pdf.setTextColor(...dark);
    pdf.text(fee.label, margin + 3, y + 6);
    pdf.text(fmt(fee.amount), pageW - margin - 3, y + 6, { align: 'right' });
    pdf.setDrawColor(241, 245, 249);
    pdf.line(margin, y + 9, pageW - margin, y + 9);
    y += 9;
  }

  y += 4;

  // Totals box
  const boxX = pageW - margin - 75;
  pdf.setTextColor(...muted);
  pdf.text('Total Fees Paid', boxX, y + 6);
  pdf.setTextColor(...dark);
  pdf.text(fmt(inv.total_fees), pageW - margin - 3, y + 6, { align: 'right' });
  y += 8;
  pdf.text('Refund Amount Received', boxX, y + 6);
  pdf.text(fmt(inv.refund_amount), pageW - margin - 3, y + 6, { align: 'right' });
  y += 10;

  pdf.setFillColor(...primary);
  pdf.rect(boxX - 5, y, pageW - margin - boxX + 5, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('TOTAL', boxX, y + 8);
  pdf.text(fmt(inv.total_fees), pageW - margin - 3, y + 8, { align: 'right' });
  y += 22;

  // Notes
  if (inv.notes) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...muted);
    pdf.text('NOTES', margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...dark);
    const lines = pdf.splitTextToSize(inv.notes, pageW - margin * 2);
    pdf.text(lines, margin, y + 6);
    y += 6 + lines.length * 5 + 4;
  }

  // Signature
  if (inv.signature_url) {
    const sig = await imgToDataUrl(inv.signature_url);
    if (sig) {
      const sigH = 18;
      const sigW = Math.min(50, (sig.w / sig.h) * sigH);
      pdf.addImage(sig.data, 'PNG', pageW - margin - sigW, y, sigW, sigH);
      pdf.setDrawColor(...muted);
      pdf.line(pageW - margin - sigW, y + sigH + 1, pageW - margin, y + sigH + 1);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...muted);
      pdf.text(inv.signatory_name || 'Authorized Signature', pageW - margin - sigW / 2, y + sigH + 6, { align: 'center' });
    }
  }

  // Footer
  pdf.setFillColor(...primary);
  pdf.rect(0, 287, pageW, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(`Thank you for choosing ${inv.company_name}`, pageW / 2, 293, { align: 'center' });

  return pdf.output('blob');
};

export const downloadInvoicePdf = async (inv: InvoiceData) => {
  const blob = await generateInvoicePdf(inv);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${inv.invoice_number}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
