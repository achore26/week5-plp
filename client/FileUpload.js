import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onUpload }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length) {
      onUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag & drop files here, or click to select</p>
    </div>
  );
}
