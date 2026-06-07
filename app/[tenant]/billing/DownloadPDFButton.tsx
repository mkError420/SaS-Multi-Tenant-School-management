'use client';

import type { BillingRecord } from '../../../lib/school';
import type { Tenant } from '../../../lib/tenant';

export default function DownloadPDFButton({ invoice, tenant }: { invoice: BillingRecord, tenant: Tenant }) {
  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice_${invoice.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: bold; color: #0ea5e9; margin: 0; }
            .info { margin-top: 40px; display: flex; justify-content: space-between; }
            .info-box { width: 45%; }
            .table { margin-top: 40px; border-collapse: collapse; width: 100%; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            .table th { background-color: #f8fafc; font-weight: 600; color: #475569; }
            .total { text-align: right; margin-top: 20px; font-size: 20px; font-weight: bold; color: #0f172a; }
            .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #64748b; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">INVOICE</h1>
              <p style="margin-top: 5px; color: #64748b; font-size: 14px;">#INV-${invoice.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div style="text-align: right; font-size: 14px; line-height: 1.5;">
              <strong>Zass SaaS Platform</strong><br>
              support@zass.com<br>
              Billing Department
            </div>
          </div>
          
          <div class="info">
            <div class="info-box" style="font-size: 14px; line-height: 1.6;">
              <p style="color: #64748b; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; font-weight: bold;">Billed To:</p>
              <strong style="font-size: 16px; color: #0f172a;">${tenant.name}</strong><br>
              ${tenant.city}<br>
            </div>
            <div class="info-box" style="text-align: right; font-size: 14px;">
              <p style="margin: 0 0 8px 0;"><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p style="margin: 0 0 8px 0;"><strong>Due Date:</strong> ${invoice.due}</p>
              <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${invoice.status === 'paid' ? '#10b981' : '#ef4444'};">${invoice.status}</span></p>
            </div>
          </div>
          <table class="table">
            <thead><tr><th>Description</th><th style="text-align: right;">Amount</th></tr></thead>
            <tbody><tr><td>${invoice.label}</td><td style="text-align: right;">&#2547;${invoice.amount.toLocaleString()}</td></tr></tbody>
          </table>
          <div class="total">Total Due: &#2547;${invoice.amount.toLocaleString()}</div>
          <div class="footer">Thank you for your business. Please process the payment by the due date.</div>
          <script>window.onload = () => { setTimeout(() => { window.print(); }, 300); }</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button onClick={handleDownload} className="rounded-lg bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20">
      Download PDF
    </button>
  );
}