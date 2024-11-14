export default function TimeGridEvent({ calendarEvent }) {
    return (
        <>
            <div>
                <span>{calendarEvent.title}</span>

                {calendarEvent.status === 'todo' && <>todo</>}
                {calendarEvent.status === 'in_progress' && <>in_progress</>}
                {calendarEvent.status === 'verift' && <>verift</>}
                {calendarEvent.status === 'done' && <>done</>}
            </div>
        </>
    );
}
