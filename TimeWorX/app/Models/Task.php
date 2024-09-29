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

    // Đảm bảo các cột ngày tháng được xử lý tự động dưới dạng đối tượng Carbon
    protected $dates = [
        'deleted_at',
        'deadline', 
    ];

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
        return Carbon::parse($this->deadline)->format('d/m/Y');
    }
}
