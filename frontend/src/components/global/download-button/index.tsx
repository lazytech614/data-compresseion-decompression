import { Button } from "@/components/ui/button";

//TODO: update the type
export default function DownloadButton({ base64, fileName }: any) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  return (
    <Button
      onClick={handleDownload}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      Download {fileName}
    </Button>
  );
}
