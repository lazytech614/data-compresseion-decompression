import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const MultiMetricBarChart = ({normalizedData}: any) => (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={normalizedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="algorithm" tick={{ fill: '#9CA3AF' }} />
          <YAxis tick={{ fill: '#9CA3AF' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name]}
          />
          <Legend />
          <Bar dataKey="compressionScore" fill="#3B82F6" name="Compression Efficiency" />
          <Bar dataKey="speedNorm" fill="#10B981" name="Speed" />
          <Bar dataKey="cpuEfficiency" fill="#F59E0B" name="CPU Efficiency" />
          <Bar dataKey="memoryEfficiency" fill="#EF4444" name="Memory Efficiency" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );