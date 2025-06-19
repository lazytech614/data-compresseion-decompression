import { Zap, FileText, Settings } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Lightning Fast",
      description: "Optimized algorithms for maximum performance"
    },
    {
      icon: <FileText className="w-8 h-8 text-green-400" />,
      title: "Multiple Formats",
      description: "Support for all major file formats"
    },
    {
      icon: <Settings className="w-8 h-8 text-purple-400" />,
      title: "Advanced Options",
      description: "Fine-tune compression parameters"
    }
  ];

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
          </div>
          <p className="text-slate-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}