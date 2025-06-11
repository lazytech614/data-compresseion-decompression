const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'; 

//TODO: update the formdata type
export async function postCompression(formData: any) {
  // formData is a FormData with fields: file (Blob), algorithm (string), metadata (if needed)
  const res = await fetch(`${API_BASE}/api/compress`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Compression API error');
  return res.json();
}

export async function postDecompression(formData: any) {
  const res = await fetch(`${API_BASE}/api/decompress`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Decompression API error');
  return res.json();
}

export async function fetchAlgorithms() {
  const res = await fetch(`${API_BASE}/api/algorithms`);
  if (!res.ok) throw new Error('Failed to load algorithms');
  return res.json();
}
