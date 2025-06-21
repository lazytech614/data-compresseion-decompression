import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

export const ScatterPlotChart = ({algorithmData}: any) => (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Speed vs Compression Efficiency</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            dataKey="speed" 
            name="Speed (MB/s)"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Processing Speed (MB/s)', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
          />
          <YAxis 
            type="number" 
            dataKey="spaceSaved" 
            name="Space Saved (%)"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Space Saved (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value, name, props) => [
              name === 'Speed (MB/s)' ? `${value} MB/s` : `${value}%`,
              name
            ]}
            labelFormatter={(label) => algorithmData.find((d: any) => d.speed === label)?.name || ''}
          />
          <Scatter data={algorithmData} fill="#8884d8">
            {algorithmData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );