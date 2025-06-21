import { Button } from "@/components/ui/button";
import { Activity, Download, FileText, Zap } from "lucide-react";

const QuickActions = () => {
  const actions = [
    { title: 'Compress Files', icon: Zap, color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'Decompress', icon: Download, color: 'bg-green-600 hover:bg-green-700' },
    { title: 'Batch Process', icon: FileText, color: 'bg-purple-600 hover:bg-purple-700' },
    { title: 'View Analytics', icon: Activity, color: 'bg-orange-600 hover:bg-orange-700' }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{action.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;