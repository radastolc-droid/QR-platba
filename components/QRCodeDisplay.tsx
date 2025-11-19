
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import { MY_IBAN, MY_ACCOUNT_NUMBER, DEFAULT_CURRENCY } from '../constants';
import { PaymentData } from '../types';

interface QRCodeDisplayProps {
  data: PaymentData;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  // Czech QR Code Standard (SPAY) Construction
  // Format: SPD*1.0*ACC:<IBAN>*AM:<AMOUNT>*CC:<CURRENCY>*MSG:<MESSAGE>*X-VS:<VS>
  const generateSpayString = () => {
    const parts = [
      'SPD*1.0',
      `ACC:${MY_IBAN}`,
      `AM:${data.amount.toFixed(2)}`,
      `CC:${DEFAULT_CURRENCY}`,
    ];

    if (data.message) {
      // Remove illegal characters for QR string if necessary, keeping it simple for now
      // SPAY suggests standard ASCII, but UTF-8 often works in modern banking apps. 
      // We will basic sanitization to safe URL encoded or keep as is.
      // Standard recommends limiting length and safe chars.
      const safeMsg = data.message.substring(0, 60).replace(/\*/g, '');
      parts.push(`MSG:${safeMsg}`);
    }

    if (data.variableSymbol) {
      const safeVs = data.variableSymbol.replace(/\D/g, '').substring(0, 10);
      if (safeVs) parts.push(`X-VS:${safeVs}`);
    }

    return parts.join('*');
  };

  const qrString = generateSpayString();

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-platba-${data.amount}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(MY_ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="mb-6 p-4 bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <QRCodeCanvas
          id="qr-canvas"
          value={qrString}
          size={220}
          level={"M"}
          includeMargin={true}
        />
      </div>
      
      <div className="w-full space-y-3 text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Příjemce (Váš účet)</div>
        <button 
          onClick={copyAccount}
          className="flex items-center justify-center gap-2 w-full text-sm font-mono bg-gray-50 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
        >
          {MY_ACCOUNT_NUMBER}
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
        <p className="text-[10px] text-gray-400 font-mono">{MY_IBAN}</p>
      </div>

      <button
        onClick={downloadQR}
        className="mt-6 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
      >
        <Download size={18} />
        Stáhnout QR Kód
      </button>
    </div>
  );
};
