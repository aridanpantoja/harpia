/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';

import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';

type FileProps = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

type FileUploaderProps = {
  maxSize?: number;
  initialFiles?: FileProps[];
};

export function FileUploader({
  maxSize = 10 * 1024 * 1024,
  initialFiles,
}: FileUploaderProps) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    initialFiles,
  });

  const file = files[0];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {/** biome-ignore lint/a11y/useSemanticElements: intentional */}
      {/** biome-ignore lint/a11y/useFocusableInteractive: intentional */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: intentional */}
      <div
        className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-input border-dashed p-4 transition-colors hover:cursor-pointer hover:bg-primary/5 has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
      >
        <input
          {...getInputProps()}
          aria-label="Upload file"
          className="sr-only"
          disabled={Boolean(file)}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          >
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 font-medium text-sm">Subir arquivo</p>
          <p className="text-muted-foreground text-xs">
            Arraste e solte ou clique para navegar (max. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {file && (
        <div className="w-full space-y-2">
          <div
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
            key={file.id}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-primary"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-[13px]">
                  {file.file.name}
                </p>
              </div>
            </div>

            <Button
              aria-label="Remove file"
              className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              onClick={() => removeFile(files[0]?.id)}
              size="icon"
              variant="ghost"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
