//TODO: update the type
export default function StatsDisplay({ stats }: any) {
  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow mb-6">
      <table className="w-full text-left">
        <tbody>
          <tr>
            <td className="py-1">Original Size:</td>
            <td className="py-1 font-medium">{stats.originalSize} bytes</td>
          </tr>
          <tr>
            <td className="py-1">New Size:</td>
            <td className="py-1 font-medium">{stats.newSize} bytes</td>
          </tr>
          <tr>
            <td className="py-1">Compression Ratio:</td>
            <td className="py-1 font-medium">{stats.compressionRatio}</td>
          </tr>
          <tr>
            <td className="py-1">Time Taken:</td>
            <td className="py-1 font-medium">{stats.timeMs} ms</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
