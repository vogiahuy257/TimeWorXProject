<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'meetings';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'meeting_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'meeting_name',
        'meeting_description',
        'meeting_date',
        'meeting_time',
        'created_by_user_id',
        'meeting_type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'meeting_date' => 'date',
        'meeting_time' => 'time',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user who created the meeting.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
