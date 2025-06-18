import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Helper: convert a byte count into KB/MB/GB with 1 decimal place
function formatMB(x: number) {
  return x.toFixed(1) + " MB";
}

const UsageChart = ({ data }: { data: Array<{ date: string; compressions: number; dataProcessed: number }> }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Usage Analytics</h3>
        <div className="flex items-center space-x-2">
          <Button className="text-slate-400 hover:text-white text-sm">7 days</Button>
          <Button className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md">30 days</Button>
          <Button className="text-slate-400 hover:text-white text-sm">90 days</Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              // format the y-axis ticks
              tickFormatter={formatMB}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              // format values inside tooltip
              formatter={(value, name) =>
                name === "dataProcessed"
                  ? [`${(value as number).toFixed(1)} MB`, "Data Processed"]
                  : [value, "Compressions"]
              }
              labelFormatter={(label: string) =>
                new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              }
            />
            <Line 
              type="monotone" 
              dataKey="compressions" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="dataProcessed" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageChart;
