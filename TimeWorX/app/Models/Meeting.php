<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Mail\MeetingNotificationMail;
use App\Mail\MeetingUpdatedNotificationMail;
use Illuminate\Support\Facades\Mail;

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

    // Trong model Meeting
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id'); // Tạo mối quan hệ với User
    }


    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'meeting_date' => 'date',
        'meeting_time' => 'string',
        'deleted_at' => 'datetime',
    ];
    
    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {

        static::created(function ($meeting) 
        {
            // Add the creator to the meeting's user list automatically
            if ($meeting->created_by_user_id) {
                $meeting->users()->attach($meeting->created_by_user_id);
            }

            //tự động gửi mail sau khi tạo lịch họp
            if(true)
            {
                $users = $meeting->users; // Lấy danh sách người dùng
                foreach ($users as $user) 
                {
                    try {
                        // Mail::to($user->email)->send(new MeetingNotificationMail($meeting));
                        Mail::to($user->email)->queue(new MeetingNotificationMail($meeting));
                        //dùng này để kích hoat hàng chờ queue php artisan queue:work
                    } catch (\Throwable $e) {
                        // Ghi log lỗi khi gửi email không thành công
                        \Log::error('Failed to send email to ' . $user->email . ': ' . $e->getMessage());
                    }
                }
            }
            // Gửi mail khi cập nhật cuộc họp
        });

        static::updated(function ($meeting) {
            // Kiểm tra nếu cuộc họp có thay đổi
            if ($meeting->isDirty() && true) {
                // Lấy danh sách người dùng tham gia cuộc họp
                $users = $meeting->users;

                // Gửi email đến tất cả người tham gia
                foreach ($users as $user) {
                    try {
                        // Mail::to($user->email)->send(new MeetingUpdatedNotificationMail($meeting));
                        Mail::to($user->email)->queue(new MeetingNotificationMail($meeting));
                        //dùng này để kích hoat hàng chờ queue php artisan queue:work
                    } catch (\Throwable $e) {
                        // Ghi log lỗi khi gửi email không thành công
                        \Log::error('Failed to send email to ' . $user->email . ': ' . $e->getMessage());
                    }
                }
            }
        });
    }
    /**
     * Get the user who created the meeting.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'meeting_user', 'meeting_id', 'user_id');
    }

    /**
     * Find a user in the meeting user list by ID.
     *
     * @param string $userId
     * @return User|null
     */
    public function findUser(string $userId)
    {
        return $this->users()->where('id', $userId)->first();
    }

     /**
     * Add a user to the meeting user list.
     *
     * @param string|array $userId
     * @return void
     */
    public function addUser($userId)
    {
        // Allow adding multiple users if an array is passed
        if (is_array($userId)) {
            $this->users()->syncWithoutDetaching($userId);
        } else {
            $this->users()->attach($userId);
        }
    }

    /**
     * Remove a user from the meeting user list.
     *
     * @param string $userId
     * @return void
     */
    public function removeUser(string $userId)
    {
        $this->users()->detach($userId);
    }

    //vì laravel không hiểu đươc định dạng time của database nên chuyển thành string
    public function setMeetingTimeAttribute($value)
    {
        // Chuyển đổi thời gian thành định dạng chuẩn H:i:s
        $this->attributes['meeting_time'] = date('H:i:s', strtotime($value));
    }

    public function getMeetingTimeAttribute($value)
    {
        // Nếu bạn muốn trả về giá trị thời gian theo định dạng H:i:s
        return date('H:i:s', strtotime($value));
    }

}
