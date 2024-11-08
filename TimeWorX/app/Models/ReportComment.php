<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportComment extends Model
{
    use HasFactory;

    protected $table = 'report_comments'; // Tên bảng
    protected $primaryKey = 'comment_id'; // Khóa chính

    protected $fillable = [
        'report_id',
        'comment_by_user_id',
        'comment',
        'is_project_manager',
    ];

    /**
     * Định nghĩa quan hệ tới bảng Report
     * Một ReportComment thuộc về một Report
     */
    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id', 'report_id');
    }

    /**
     * Định nghĩa quan hệ tới bảng User
     * Một ReportComment thuộc về một User (người viết comment)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'comment_by_user_id', 'id');
    }
}
