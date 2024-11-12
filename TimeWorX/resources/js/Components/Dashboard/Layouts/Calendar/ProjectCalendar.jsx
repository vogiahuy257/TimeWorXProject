import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeftIcon, ChevronRightIcon, MoonIcon, SunIcon, PlusIcon } from '@heroicons/react/24/solid';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './css/customCalendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CustomProjectCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', start: null, end: null });
  const [currentView, setCurrentView] = useState(Views.WEEK);

  useEffect(() => {
    fetchProjectsAndTasks();
  }, []);

  const fetchProjectsAndTasks = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();

    const sampleProjects = [
      {
        id: 1,
        title: 'Website Redesign',
        start: new Date(currentYear, currentMonth, currentDate, 9, 0),
        end: new Date(currentYear, currentMonth, currentDate + 10, 17, 0),
        tasks: [
          { id: 101, title: 'Design mockups', start: new Date(currentYear, currentMonth, currentDate + 2, 10, 0), end: new Date(currentYear, currentMonth, currentDate + 2, 16, 0) },
          { id: 102, title: 'Frontend development', start: new Date(currentYear, currentMonth, currentDate + 5, 9, 0), end: new Date(currentYear, currentMonth, currentDate + 7, 17, 0) },
          { id: 103, title: 'Backend integration', start: new Date(currentYear, currentMonth, currentDate + 8, 9, 0), end: new Date(currentYear, currentMonth, currentDate + 10, 17, 0) },
        ],
      },
      {
        id: 2,
        title: 'Mobile App Launch',
        start: new Date(currentYear, currentMonth, currentDate + 5, 9, 0),
        end: new Date(currentYear, currentMonth, currentDate + 15, 17, 0),
        tasks: [
          { id: 201, title: 'Finalize features', start: new Date(currentYear, currentMonth, currentDate + 7, 10, 0), end: new Date(currentYear, currentMonth, currentDate + 9, 16, 0) },
          { id: 202, title: 'User testing', start: new Date(currentYear, currentMonth, currentDate + 10, 9, 0), end: new Date(currentYear, currentMonth, currentDate + 13, 17, 0) },
          { id: 203, title: 'App store submission', start: new Date(currentYear, currentMonth, currentDate + 13, 9, 0), end: new Date(currentYear, currentMonth, currentDate + 15, 17, 0) },
        ],
      },
    ];

    const allEvents = sampleProjects.flatMap(project => [
      { ...project, resourceId: project.id, color: '#3174ad' },
      ...project.tasks.map(task => ({
        ...task,
        resourceId: project.id,
        color: '#59a14f',
      })),
    ]);

    setEvents(allEvents);
  };

  const moveEvent = ({ event, start, end, resourceId }) => {
    const updatedEvents = events.map(existingEvent => {
      if (existingEvent.id === event.id) {
        return { ...existingEvent, start, end, resourceId };
      }
      return existingEvent;
    });
    setEvents(updatedEvents);
    console.log('Event moved:', { event, start, end, resourceId });
  };

  const resizeEvent = ({ event, start, end }) => {
    const updatedEvents = events.map(existingEvent => {
      if (existingEvent.id === event.id) {
        return { ...existingEvent, start, end };
      }
      return existingEvent;
    });
    setEvents(updatedEvents);
    console.log('Event resized:', { event, start, end });
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '5px',
      },
    };
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCreateMeeting = () => {
    setIsCreateMeetingOpen(true);
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();
    if (newMeeting.title && newMeeting.start && newMeeting.end) {
      const meetingEvent = {
        id: Date.now(),
        title: newMeeting.title,
        start: new Date(newMeeting.start),
        end: new Date(newMeeting.end),
        color: '#9c27b0',
      };
      setEvents([...events, meetingEvent]);
      setNewMeeting({ title: '', start: null, end: null });
      setIsCreateMeetingOpen(false);
    }
  };

  const formats = {
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, 'HH:mm', culture) + ' - ' + localizer.format(end, 'HH:mm', culture),
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`p-4 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Calendar</h1>

          <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleViewChange(Views.DAY)}
            className={`px-4 py-2 rounded-full ${
              currentView === Views.DAY
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
            } text-sm`}
          >
            Day
          </button>
          <button
            onClick={() => handleViewChange(Views.WEEK)}
            className={`px-4 py-2 rounded-full ${
              currentView === Views.WEEK
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
            } text-sm`}
          >
            Week
          </button>
          <button
            onClick={() => handleViewChange(Views.MONTH)}
            className={`px-4 py-2 rounded-full ${
              currentView === Views.MONTH
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'
            } text-sm`}
          >
            Month
          </button>
        </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCreateMeeting}
              className="px-4 py-2 text-sm bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Meeting
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
            >
              {isDarkMode ? <SunIcon className="h-6 w-6 text-sm" /> : <MoonIcon className="h-6 w-6 text-sm" />}
            </button>
          </div>

        </div>
       
        <div style={{ height: '500px' }}>
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            resizable
            selectable
            eventPropGetter={eventStyleGetter}
            view={currentView}
            onView={handleViewChange}
            components={{
              toolbar: CustomToolbar,
            }}
            formats={formats}
            className={` rounded-md scrollbar-hide ${isDarkMode ? 'dark-calendar' : ''}`}
          />
        </div>
        {isCreateMeetingOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <h2 className="text-xl font-bold mb-4">Create Meeting</h2>
              <form onSubmit={handleMeetingSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-2">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="start" className="block mb-2">Start</label>
                  <input
                    type="datetime-local"
                    id="start"
                    value={newMeeting.start || ''}
                    onChange={(e) => setNewMeeting({ ...newMeeting, start: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="end" className="block mb-2">End</label>
                  <input
                    type="datetime-local"
                    id="end"
                    value={newMeeting.end || ''}
                    onChange={(e) => setNewMeeting({ ...newMeeting, end: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateMeetingOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>{date.format('MMMM')} <span>{date.format('YYYY')}</span></span>
    );
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-lg font-bold">{label()}</span>
      <div className="flex space-x-2">
        <button
          onClick={goToBack}
          className="p-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
        onClick={goToCurrent}
        className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full"
      >
        Today
      </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-black text-white dark:bg-white dark:text-black"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CustomProjectCalendar;