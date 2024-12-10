<?php

namespace App\Services;

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;

class WordExporter
{
    protected string $storageDisk; // Disk lưu trữ (local, s3, etc.)
    protected string $storagePath; // Thư mục lưu file Word

    /**
     * Constructor
     * 
     * @param string $storageDisk
     * @param string $storagePath
     */
    public function __construct(string $storageDisk = 'local', string $storagePath = 'reports')
    {
        $this->storageDisk = $storageDisk;
        $this->storagePath = $storagePath;
    }

    /**
     * Chuyển đổi HTML thành file Word và lưu vào thư mục
     * 
     * @param string $html Nội dung HTML
     * @param string $fileName Tên file Word (e.g., 'report.docx')
     * @return string Đường dẫn lưu file Word
     */
    public function convertHtmlToWord(string $html, string $fileName): string
    {
        $phpWord = new PhpWord();
        $section = $phpWord->addSection();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $html);

        // Đảm bảo thư mục tồn tại
        if (!Storage::disk($this->storageDisk)->exists($this->storagePath)) {
            Storage::disk($this->storageDisk)->makeDirectory($this->storagePath);
        }

        $filePath = storage_path("app/{$this->storagePath}/{$fileName}");

        // Lưu file Word
        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($filePath);

        return $filePath;
    }
}
