<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Updated</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background-color: #000000; padding: 28px; text-align: center;">
                            <img src="https://drive.usercontent.google.com/download?id=1Ptnqw3NSDQrurTmoXvknlvdiqZlCv19d&export=view&authuser=0" alt="Company Logo" width="150" height="150"  style="max-width: 100%; border-radius: 100%; height: auto; box-shadow: 0 0 6px rgba(255, 255, 255, 0.726);">
                        </td>
                    </tr>
                    <tr>
                        <td class="content" style="padding: 40px;">
                            <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Meeting Update Notification</h1>
                            <p style="color: #666666; font-size: 16px; line-height: 1.5;">Dear Guest,</p>
                            <p style="color: #666666; font-size: 16px; line-height: 1.5;">The details for the meeting "<strong>{{ $meeting->meeting_name }}</strong>" have been updated. Below are the updated details:</p>

                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #eeeeee;">
                                        <strong style="color: #333333;">Meeting Name:</strong>
                                    </td>
                                    <td style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #eeeeee;">
                                        <span style="color: #666666;">{{ $meeting->meeting_name }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                                        <strong style="color: #333333;">Description:</strong>
                                    </td>
                                    <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                                        <span style="color: #666666;">{{ $meeting->meeting_description }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #eeeeee;">
                                        <strong style="color: #333333;">Date:</strong>
                                    </td>
                                    <td style="padding: 10px; background-color: #f8f8f8; border-bottom: 1px solid #eeeeee;">
                                        <span style="color: #666666;">{{ \Carbon\Carbon::parse($meeting->meeting_date)->format('d-m-Y') }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                                        <strong style="color: #333333;">Time:</strong>
                                    </td>
                                    <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
                                        <span style="color: #666666;">{{ \Carbon\Carbon::parse($meeting->meeting_time)->format('h:i a') }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; background-color: #f8f8f8;">
                                        <strong style="color: #333333;">Type:</strong>
                                    </td>
                                    <td style="padding: 10px; background-color: #f8f8f8;">
                                        <span style="color: #666666;">{{ $meeting->meeting_type }}</span>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #666666; font-size: 16px; line-height: 1.5;">We look forward to seeing you there!</p>

                            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-top: 30px;">Best regards,</p>
                            <p style="color: #666666; font-size: 16px; line-height: 1.5;">The Meeting Scheduling Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #000000; color: #ffffff; text-align: center; padding: 20px; font-size: 14px;">
                            &copy; 2024 TimeWor<span style="color: #1b5bc2;">X</span>. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>