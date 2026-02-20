'use client';

import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function CloudinaryDropzone({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = async (files: File[]) => {
    setUploading(true);
    const sigRes = await fetch('/api/upload-signature', { method: 'POST' });
    const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      const up = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      const json = await up.json();
      urls.push(json.secure_url);
    }

    onUploaded(urls);
    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  return (
    <div {...getRootProps()} className="glass cursor-pointer rounded-2xl border border-dashed border-az-electric/50 p-6 text-center">
      <input {...getInputProps()} />
      <p>{uploading ? 'Subiendo...' : isDragActive ? 'Suelta aquí tus fotos' : 'Arrastra y suelta fotos (estilo Instagram)'}</p>
    </div>
  );
}
