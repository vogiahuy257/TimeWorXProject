<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeePerformance extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'employee_performance';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'performance_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'task_id',
        'performance_score',
        'feedback',
        'review_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'review_date' => 'datetime',
        'performance_score' => 'decimal:2',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user associated with the performance review.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the task associated with the performance review.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
