import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CompressionTypesChart = ({ data }: any) => {
  const totalItems = data.reduce((total: any, item: any) => total + item.value, 0);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">File Types</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              labelStyle={{ color: '#000000' }}
              itemStyle={{ color: '#000000' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {(() => {
          // Step 1: calculate raw percentages
          const percentages = data.map((item: any) => ({
            ...item,
            rawPercent: (item.value / totalItems) * 100,
          }));

          // Step 2: floor the values
          const rounded = percentages.map((p: any) => ({
            ...p,
            displayPercent: Math.floor(p.rawPercent),
          }));

          // Step 3: add back the difference to make total 100%
          let remaining = 100 - rounded.reduce((sum: any, item: any) => sum + item.displayPercent, 0);

          const sorted = [...percentages]
            .map((p, i) => ({ i, frac: p.rawPercent % 1 }))
            .sort((a, b) => b.frac - a.frac);

          for (let j = 0; j < remaining; j++) {
            rounded[sorted[j].i].displayPercent += 1;
          }

          return rounded.map((item: any) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-slate-300 text-sm">{item.name}</span>
              <span className="text-slate-400 text-sm">{item.displayPercent}%</span>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default CompressionTypesChart;
