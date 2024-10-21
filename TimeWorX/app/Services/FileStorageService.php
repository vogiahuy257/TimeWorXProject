<?php
namespace App\Services;

use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    protected $storagePath;

    public function __construct($storagePath = 'documents')
    {
        $this->storagePath = $storagePath;
    }

    public function storeFile($file)
    {
        return $file->store($this->storagePath, 'public');
    }

    public function setStoragePath($storagePath)
    {
        $this->storagePath = $storagePath;
    }

    public function deleteFile($filename)
    {
        if (strpos($filename, $this->storagePath) !== false) 
        {
            $filePath = '/'. $filename;
        } 
        else 
        {
            // Nếu không chứa, thêm 'documents/' vào trước filename
            $filePath = $this->storagePath . '/' . $filename;
        }

        // Kiểm tra nếu file tồn tại trước khi xóa
        if (Storage::disk('public')->exists($filePath)) 
        {
            return Storage::disk('public')->delete($filePath);
        } 

        return false;
    }

}
