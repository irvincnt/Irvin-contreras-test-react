import React, { useState, DragEvent, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import './index.css';
import AuthGuard from './components/AuthGuard';
import { UploadedFile } from './interfaces';

function UploadApp(): React.ReactElement {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const filesRef = useRef<UploadedFile[]>([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, []);

  const handleDrag = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList): void => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const nextFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file: File) => {
      const fileType = file.type || '';
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidType = validTypes.includes(fileType.toLowerCase()) || (extension ? ['png', 'jpeg', 'jpg'].includes(extension) : false);

      if (!isValidType) {
        setError('Formato no permitido. Solo se admiten imágenes PNG, JPG o JPEG.');
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      nextFiles.push({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'image',
        uploadProgress: 100,
        previewUrl,
      });
    });

    if (nextFiles.length > 0) {
      setError('');
      setFiles((prev: UploadedFile[]) => [...prev, ...nextFiles]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k: number = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const removeFile = (id: number): void => {
    const targetFile = files.find((file: UploadedFile) => file.id === id);
    if (targetFile?.previewUrl) {
      URL.revokeObjectURL(targetFile.previewUrl);
    }
    setFiles(files.filter((file: UploadedFile) => file.id !== id));
  };

  const clearAll = (): void => {
    files.forEach((file: UploadedFile) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setFiles([]);
    setError('');
  };


  return (
    <div className="space-y-6">

      <div className=" p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">Gestor de Archivos</h1>
            <p className="text-gray-800 mt-1">Sube y gestiona tus archivos de forma fácil</p>
          </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col">
            <form
              onDragEnter={handleDrag}
              onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
              className="flex-1"
            >
              <input
                type="file"
                id="file-upload"
                accept="image/png,image/jpeg"
                onChange={handleChange}
                className="hidden"
              />

              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all duration-200 h-full min-h-[320px] ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 shadow-inner'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-6xl mb-4">☁️</div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Arrastra y suelta tu imagen
                  </p>
                  <p className="text-sm text-gray-500 mb-4">Formatos permitidos: PNG, JPG, JPEG</p>
                  <span className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 inline-block">
                    Seleccionar Imagen
                  </span>
                </div>
              </label>
            </form>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Vista previa</h2>
              <p className="text-sm text-gray-500">
                {files.length > 0
                  ? `Has cargado ${files.length} ${files.length === 1 ? 'imagen' : 'imágenes'}`
                  : 'Aún no has cargado imágenes.'}
              </p>
            </div>
            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Eliminar Todas
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-8">
      
              <p className="text-lg font-medium">No hay imágenes cargadas</p>
              <p className="text-sm">Selecciona o arrastra una imagen para ver su vista previa aquí.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr overflow-y-auto pr-1">
              {files.map((file: UploadedFile) => (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                >
                  <div className="relative bg-gray-100">
                  
                    <img
                        src={file.previewUrl || ''}
                        alt={file.name}
                        className="w-full h-48 object-cover"
                      />
                    <span className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                      {file.size}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 break-words line-clamp-2">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {file.type || 'Imagen'}
                      </p>
                    </div>



                    <div className="pt-2 mt-auto flex justify-end">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App(): React.ReactElement {
  return (
    <AuthGuard>
      <UploadApp />
    </AuthGuard>
  );
}

export default App;

