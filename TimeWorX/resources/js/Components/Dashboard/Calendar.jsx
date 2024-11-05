import { Head } from '@inertiajs/react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import {useEffect} from "react";

export default function Calendar({ auth }) {
    const plugins = [createEventsServicePlugin()]
 
    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events: [
        {
            id: '1',
            title: 'Event 1',
            start: '2023-12-16',
            end: '2023-12-16',
        },
        ],
    }, plugins)
    
    useEffect(() => {
        // get all events
        calendar.eventsService.getAll()
    }, [])

    return (
        <>
        <Head title="Calendar" />
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
        </>
    );
}
