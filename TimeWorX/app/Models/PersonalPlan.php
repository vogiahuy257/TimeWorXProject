<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonalPlan extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'personal_plans';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'plan_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'plan_name',
        'plan_description',
        'start_date',
        'end_date',
        'plan_status',
        'plan_priority',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user associated with the personal plan.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
