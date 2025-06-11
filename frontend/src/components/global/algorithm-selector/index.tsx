import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";


//TODO: Update the type
export default function AlgorithmSelector({ algorithms, selected, onChange }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[var(--text-light)] mb-1">Choose Algorithm:</label>
      <Select
        value={selected}
        onValueChange={(e) => onChange(e)}
      >
        <SelectTrigger className="w-full px-2 py-1">
          <SelectValue placeholder="Select an algorithm" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--card-dark)] text-[var(--text-light)]">
          {algorithms.map((algo: any) => (
            <SelectItem 
              key={algo.id} 
              value={algo.id}
            >
              {algo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
