import { Download, Upload } from "lucide-react";

interface ProcessingButtonProps {
  mode: 'compress' | 'decompress';
  loading: boolean;
  isFormValid: boolean;
  onClick: () => void;
}

export default function ProcessingButton({ 
  mode, 
  loading, 
  isFormValid, 
  onClick 
}: ProcessingButtonProps) {
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={loading || !isFormValid}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {mode === 'compress' ? (
            <Download className="w-5 h-5" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          <span>
            {mode === 'compress' ? 'Compress File' : 'Decompress File'}
          </span>
        </>
      )}
    </button>
  );
}