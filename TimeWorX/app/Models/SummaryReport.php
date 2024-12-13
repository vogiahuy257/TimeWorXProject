<?php

namespace App\Models;

use App\Services\ReportZipper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class SummaryReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'summary_report_id';

    protected $fillable = [
        'project_id',
        'name',
        'reported_by_user_id',
        'report_date',
        'summary',
        'completed_tasks',
        'upcoming_tasks',
        'project_issues',
        'zip_name',
        'zip_file_path',
    ];

    /**
     * Relationship với Project
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id', 'project_id');
    }

    /**
     * Relationship với User
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by_user_id', 'id');
    }

    /**
     * Tạo báo cáo tổng hợp cùng file ZIP
     *
     * @param array $data
     * @param ReportZipper $zipper
     * @return SummaryReport
     * @throws \Exception
     */
    public static function createWithZip(array $data, ReportZipper $zipper): SummaryReport
    {
        return DB::transaction(function () use ($data, $zipper) 
        {
            // Tạo báo cáo
            $summaryReport = self::create([
                'project_id' => $data['project_id'],
                'name' => $data['name'],
                'reported_by_user_id' => $data['reported_by_user_id'],
                'report_date' => $data['report_date'],
                'summary' => $data['summary'],
                'completed_tasks' => $data['completed_tasks'] ?? null,
                'upcoming_tasks' => $data['upcoming_tasks'] ?? null,
                'project_issues' => $data['project_issues'] ?? null,
            ]);

            // Kiểm tra xem có danh sách file không
            if (!empty($data['report_files']) && is_array($data['report_files'])) 
            {
                // Tạo file ZIP từ danh sách file
                $zipFileName = "summary_report_{$summaryReport->summary_report_id}.zip";
                $files = [];
                foreach ($data['report_files'] as $filePath) 
                {
                    $files[$filePath] = basename($filePath);
                }

                $zipPath = $zipper->createZip($zipFileName, $files);

                // Cập nhật thông tin ZIP
                $summaryReport->update([
                    'zip_name' => $zipFileName,
                    'zip_file_path' => $zipPath,
                ]);
            }

            return $summaryReport;
        });
    }
}
