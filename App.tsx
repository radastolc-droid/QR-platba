import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, Hash, MessageSquare, Coins } from 'lucide-react';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { SmartParser } from './components/SmartParser';
import { PaymentData, ParsedPaymentResponse } from './types';

export default function App() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    variableSymbol: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleParsedData = (data: ParsedPaymentResponse) => {
    setPaymentData({
      amount: data.amount,
      variableSymbol: data.variableSymbol || '',
      message: data.message || '',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Generátor <span className="text-indigo-600">QR Platby</span>
            </h1>
            <p className="mt-2 text-slate-500 text-lg">
              Snadné vytvoření kódu pro váš fixní účet.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full inline-block">
              CZ Standard (SPAY)
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* AI Input Section */}
            <SmartParser onParsed={handleParsedData} />

            {/* Manual Input Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">
                  Manuální zadání
                </h3>

                <div className="space-y-5">
                  {/* Amount Input */}
                  <div className="group">
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Částka (CZK)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Coins className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        min="0"
                        step="1"
                        value={paymentData.amount || ''}
                        onChange={handleInputChange}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Variable Symbol Input */}
                  <div className="group">
                    <label htmlFor="variableSymbol" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Variabilní symbol
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="variableSymbol"
                        id="variableSymbol"
                        maxLength={10}
                        value={paymentData.variableSymbol}
                        onChange={(e) => {
                            // Allow only numbers
                            const val = e.target.value.replace(/\D/g, '');
                            setPaymentData({...paymentData, variableSymbol: val});
                        }}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono"
                        placeholder="Např. 2024001"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Zpráva pro příjemce
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3 pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="message"
                        id="message"
                        maxLength={60}
                        value={paymentData.message}
                        onChange={handleInputChange}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="Např. Faktura za služby"
                      />
                      <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                        {paymentData.message.length}/60
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="flex flex-col gap-4">
                <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Banknote size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-indigo-200 font-medium uppercase">Celkem k úhradě</p>
                      <p className="text-2xl font-bold">{new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(paymentData.amount)}</p>
                    </div>
                  </div>
                </div>

                <QRCodeDisplay data={paymentData} />
                
                <p className="text-center text-sm text-gray-400 mt-2">
                  Naskenujte kód ve vaší mobilní bankovní aplikaci.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}