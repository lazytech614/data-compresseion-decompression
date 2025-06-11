//TODO: Update the type

export default function AlgorithmSelector({ algorithms, selected, onChange }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Choose Algorithm:</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1"
      >
        {algorithms.map((algo: any) => (
          <option key={algo.id} value={algo.id}>
            {algo.name}
          </option>
        ))}
      </select>
    </div>
  );
}
