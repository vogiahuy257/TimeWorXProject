<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'files';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'file_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'file_name',
        'uploaded_by',
        'uploaded_at',
        'project_id',
        'file_type',
        'file_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'uploaded_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user who uploaded the file.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the project that the file belongs to.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
