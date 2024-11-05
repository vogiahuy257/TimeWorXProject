<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Task extends Model
{
    use SoftDeletes;

    protected $table = 'tasks';

    protected $primaryKey = 'task_id';

    protected $fillable = [
        'project_id',
        'task_name',
        'task_description',
        'status_key',
        'assigned_to_user_id',
        'deadline', 
    ];

     // Quan hệ belongsTo với model Project
     public function project()
     {
         return $this->belongsTo(Project::class, 'project_id');
     }
 
     // Hàm lấy tên của project
     public function getProjectName()
     {
         return $this->project() ? $this->project->project_name : null;
     }
    // Đảm bảo các cột ngày tháng được xử lý tự động dưới dạng đối tượng Carbon
    protected $dates = [
        'deleted_at',
        'updated_at',
        'created_at',
        'deadline', 
    ];

    // Tự động kiểm tra và cập nhật trạng thái deadline
    public function checkDeadlineStatus()
    {
        $now = Carbon::now();

        if ($this->deadline && $this->status_key != 'done') 
        {
            // Kiểm tra nếu task đã trễ
            if ($now->isAfter($this->deadline)) 
            {
                $this->is_late = true;
                $this->is_near_deadline = false;
            }
            // Kiểm tra nếu task gần hết hạn (2 ngày trước deadline)
            elseif ($now->diffInDays($this->deadline) <= 2) {
                $this->is_near_deadline = true;
                $this->is_late = false;
            } 
            // Nếu không trễ và không gần hết hạn
            else {
                $this->is_late = false;
                $this->is_near_deadline = false;
            }
        } 
        else 
        {
            // Không có deadline
            $this->is_late = false;
            $this->is_near_deadline = false;
        }

        // Lưu thay đổi vào database
        $this->save();
    }

    // Quan hệ nhiều-nhiều với User
    public function users()
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }

    // Quan hệ một-nhiều với User (người được giao nhiệm vụ)
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    // Lấy số lượng người dùng liên quan đến task này
    public function userCount()
    {
        return $this->users()->count();
    }

    // Định nghĩa hàm để lấy định dạng ngày deadline (nếu cần)
    public function getFormattedDeadlineAttribute()
    {
        return Carbon::parse($this->deadline)->format('d-m-Y');
    }
}
