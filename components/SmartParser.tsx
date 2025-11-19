import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { parsePaymentText } from '../services/gemini';
import { ParsedPaymentResponse } from '../types';

interface SmartParserProps {
  onParsed: (data: ParsedPaymentResponse) => void;
}

export const SmartParser: React.FC<SmartParserProps> = ({ onParsed }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await parsePaymentText(input);
      onParsed(result);
      setInput(''); // Clear input on success
    } catch (err) {
      setError("Nepodařilo se zpracovat text. Zkuste to prosím znovu nebo zadejte údaje ručně.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 mb-6">
      <div className="flex items-center gap-2 mb-3 text-indigo-600 font-medium">
        <Sparkles size={20} />
        <h2>AI Rychlé vyplnění</h2>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Vložte text (např. z emailu či SMS) a nechte AI vyplnit údaje. 
        <br/><i>Příklad: "Zaplať 500 Kč za oběd, VS 202301"</i>
      </p>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sem vložte text s platebními údaji..."
          className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 text-sm transition-all"
          disabled={isLoading}
        />
        
        <button
          onClick={handleParse}
          disabled={!input.trim() || isLoading}
          className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
            !input.trim() || isLoading 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
          }`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded-lg">{error}</p>
      )}
    </div>
  );
};