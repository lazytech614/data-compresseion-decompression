import { Download, Upload } from "lucide-react";

interface ModeSelectorProps {
  mode: 'compress' | 'decompress';
  onModeChange: (mode: 'compress' | 'decompress') => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-4">
        Operation Mode
      </label>
      <div className="flex flex-col sm:flex-row gap-y-4 space-x-4">
        {(['compress', 'decompress'] as const).map((modeOption) => (
          <label
            key={modeOption}
            className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex-1 ${
              mode === modeOption
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
            }`}
          >
            <input
              type="radio"
              name="mode"
              value={modeOption}
              checked={mode === modeOption}
              onChange={() => onModeChange(modeOption)}
              className="sr-only"
            />
            <div className={`p-2 rounded-lg ${
              mode === modeOption ? 'bg-blue-500/20' : 'bg-slate-700'
            }`}>
              {modeOption === 'compress' ? (
                <Download className={`w-5 h-5 ${
                  mode === modeOption ? 'text-blue-400' : 'text-slate-400'
                }`} />
              ) : (
                <Upload className={`w-5 h-5 ${
                  mode === modeOption ? 'text-blue-400' : 'text-slate-400'
                }`} />
              )}
            </div>
            <div>
              <span className={`font-medium capitalize ${
                mode === modeOption ? 'text-blue-300' : 'text-slate-300'
              }`}>
                {modeOption}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {modeOption === 'compress' ? 'Reduce file size' : 'Restore original file'}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}