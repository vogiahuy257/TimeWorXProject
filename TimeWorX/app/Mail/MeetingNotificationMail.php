<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MeetingNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $meeting; // Biến chứa thông tin cuộc họp

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($meeting)
    {
        $this->meeting = $meeting;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('New Meeting Scheduled: ' . $this->meeting->meeting_name)
                    ->view('emails.meeting_notification')
                    ->with([
                        'meeting' => $this->meeting,
                    ]);
    }
}
