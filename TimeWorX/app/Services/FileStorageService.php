<?php
namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileStorageService
{
    protected $storagePath;

    public function __construct($storagePath = 'documents')
    {
        $this->storagePath = $storagePath;
    }

    public function storeFile($file)
    {
        $this->ensureStoragePathExists(); // Đảm bảo thư mục lưu trữ tồn tại

        $storedPath = $file->store($this->storagePath, 'public'); // Lưu tệp vào disk 'public'

        // Kiểm tra tệp có được lưu thành công hay không
        if (!Storage::disk('public')->exists($storedPath)) {
            // Ghi lỗi vào log
            Log::error("File not saved correctly at path: $storedPath", [
                'storagePath' => $this->storagePath,
                'fileName' => $file->getClientOriginalName(),
            ]);

            // Ném ngoại lệ để xử lý tiếp
            throw new \Exception("File not saved correctly at path: $storedPath");
        }

        return $storedPath; // Trả về đường dẫn lưu trữ
    }

    public function setStoragePath($storagePath)
    {
        $this->storagePath = $storagePath;
        $this->ensureStoragePathExists(); // Đảm bảo thư mục tồn tại khi thay đổi đường dẫn
    }

    public function deleteFile($filename)
    {
        if (strpos($filename, $this->storagePath) !== false) 
        {
            $filePath = '/' . $filename;
        } 
        else 
        {
            $filePath = $this->storagePath . '/' . $filename;
        }

        if (Storage::disk('public')->exists($filePath)) 
        {
            return Storage::disk('public')->delete($filePath);
        }

        return;
    }

    /**
     * Đảm bảo thư mục lưu trữ tồn tại
     */
    protected function ensureStoragePathExists()
    {
        if (!Storage::disk('public')->exists($this->storagePath)) {
            Storage::disk('public')->makeDirectory($this->storagePath);
        }
    }
}
