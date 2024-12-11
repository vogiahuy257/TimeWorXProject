<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        'is_pinned',
    ];

    /**
     * Định nghĩa quan hệ tới bảng Task
     * Một ReportComment thuộc về một Task
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    /**
     * Định nghĩa quan hệ tới bảng User
     * Một ReportComment thuộc về một User (người viết comment)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'comment_by_user_id', 'id');
    }

     // Hàm để lấy các bình luận được ghim
     public static function getPinnedComments($taskId)
     {
         return self::where('task_id', $taskId)
             ->where('is_pinned', true)
             ->get();
     }
}
