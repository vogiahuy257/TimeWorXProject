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
}
