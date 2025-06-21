import { Button } from '@/components/ui/button';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';

function formatMB(x: number) {
  return x.toFixed(1) + " MB";
}

const UsageChart = ({ data }: { 
  data: Array<{ 
    date: string; 
    compressions: number; 
    dataProcessed: number 
  }> 
}) => {
  const totalCompressions = data.reduce((acc, d) => acc + d.compressions, 0);
  const totalDataProcessed = data.reduce((acc, d) => acc + d.dataProcessed, 0);
  const avgDaily = totalCompressions / Math.max(data.length, 1);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Usage Analytics</h3>
            <p className="text-sm text-slate-400">Compression activity over time</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
            7 days
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            30 days
          </Button>
          <Button className="text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
            90 days
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-lg font-bold text-white">{totalCompressions}</p>
              <p className="text-xs text-slate-400">Total Compressions</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-lg font-bold text-white">{avgDaily.toFixed(1)}</p>
              <p className="text-xs text-slate-400">Daily Average</p>
            </div>
          </div>
        </div> 
        <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-lg font-bold text-white">{totalDataProcessed.toFixed(1)} MB</p>
              <p className="text-xs text-slate-400">Data Processed</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="compressionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="dataGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              tickFormatter={formatMB}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid #374151',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              labelStyle={{ color: '#0ABD50' }} 
              itemStyle={{ color: '#D1D5DB' }}
              formatter={(value, name) =>
                name === "dataProcessed"
                  ? [`${(value as number).toFixed(1)} MB`, "Data Processed"]
                  : [value, "Compressions"]
              }
              labelFormatter={(label: string) =>
                new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              }
            />
            <Area
              type="monotone"
              dataKey="compressions"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#compressionGradient)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="dataProcessed"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#dataGradient)"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
            />
            {/* Reference line for average */}
            <ReferenceLine 
              y={avgDaily} 
              stroke="#F59E0B" 
              strokeDasharray="5 5" 
              strokeOpacity={0.7}
              label={{ value: "Avg", position: "top", fill: "#F59E0B", fontSize: 12 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-slate-400">Compressions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-400">Data Processed (MB)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-yellow-500"></div>
          <span className="text-sm text-slate-400">Daily Average</span>
        </div>
      </div>
    </div>
  );
};

export default UsageChart;