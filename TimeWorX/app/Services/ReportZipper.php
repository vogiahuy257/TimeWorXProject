<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ReportZipper
{
    protected string $storageDisk; // Tên disk (local, s3, etc.)
    protected string $storagePath; // Đường dẫn thư mục lưu file ZIP

    /**
     * Constructor
     * 
     * @param string $storageDisk
     * @param string $storagePath
     */
    public function __construct(string $storageDisk = 'local', string $storagePath = 'zipped_reports')
    {
        $this->storageDisk = $storageDisk;
        $this->storagePath = $storagePath;
    }

    /**
     * Tạo file ZIP từ danh sách file báo cáo
     * 
     * @param string $zipFileName Tên file ZIP (e.g., 'project_reports.zip')
     * @param array $files Danh sách file (['file_path' => 'Tên file trong ZIP'])
     * @return string Đường dẫn đầy đủ tới file ZIP
     * 
     * @throws \Exception
     */
    public function createZip(string $zipFileName, array $files): string
    {
        // Đảm bảo thư mục tồn tại
        if (!Storage::disk($this->storageDisk)->exists($this->storagePath)) {
            Storage::disk($this->storageDisk)->makeDirectory($this->storagePath);
        }
        
        // Đường dẫn lưu file ZIP
        $zipPath = storage_path("app/{$this->storagePath}/{$zipFileName}");


        // Mở file ZIP
        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            foreach ($files as $filePath => $fileNameInZip) {
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $fileNameInZip);
                } else {
                    throw new \Exception("File not found: {$filePath}");
                }
            }
            $zip->close();
        } else {
            throw new \Exception("Could not create ZIP file: {$zipFileName}");
        }

        return $zipPath;
    }

    /**
     * Xóa file ZIP khỏi storage
     * 
     * @param string $zipFileName
     * @return bool
     */
    public function deleteZip(string $zipFileName): bool
    {
        $zipPath = "{$this->storagePath}/{$zipFileName}";

        if (Storage::disk($this->storageDisk)->exists($zipPath)) {
            return Storage::disk($this->storageDisk)->delete($zipPath);
        }

        return false;
    }
}
