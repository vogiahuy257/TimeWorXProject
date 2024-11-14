import React, { useState, useCallback, useEffect, useRef } from 'react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './css/customCalendar.css'

const SimpleCalendar = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))

  useEffect(() => {
    setCurrentMonth(new Date(selectedDate))
  }, [selectedDate])

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => addDays(prevMonth, -30))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addDays(prevMonth, 30))
  }

  return (
    <div className="p-4 w-full h-auto border rounded-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></button>
        <span>{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}
        {daysInMonth.map(date => (
          <button
            key={date.toString()}
            onClick={() => onChange(date)}
            className={`p-2 text-center rounded-full ${
              format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </div>
  )
}

function FullCalendarComponent({ auth }) {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const calendarRef = useRef(null)

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`/api/projects/${auth.user.id}/projects-tasks`)
      const projectData = response.data
      const mappedEvents = projectData.projects.map((task) => ({
        id: task.project_id,
        title: task.project_name,
        start: task.start_date,
        end: task.end_date,
        tasksCount: task.tasks_count,
        userCount: task.user_count,
        description: task.project_description,
        extendedProps: {
          status: task.project_status,
          isProject: true
        },
      }))
      setEvents(mappedEvents)
      setProjects(projectData.projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchEvents = async (projectId) => {
    if (projectId === 'allproject') {
      return fetchProjects()
    }
    else if(projectId){
      try {
        const url = `/api/project-view/${projectId}`
        const response = await axios.get(url)
        const taskData = response.data.tasks
        const mappedEvents = Object.values(taskData).flat().map((task) => {
          const [day, month, yearTime] = task.deadline.split('-');
          const [year, time] = yearTime.split(' ');
          const [hour, minute] = time.split(':');
          const formattedDeadline = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`).toISOString();
          
          return {
            id: task.id,
            title: task.content,
            start: task.created_at,
            end: formattedDeadline,
            description: task.description,
            extendedProps: {
              status: task.status,
              isLate: task.is_late,
              isNearDeadline: task.is_near_deadline,
              userCount: task.user_count,
              isProject: false
            },
          };
        });
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
}

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchEvents(selectedProjectId)
  }, [selectedProjectId])

  const handleEventDrop = useCallback((info) => {
    const { event } = info

    // Kiểm tra loại sự kiện dựa trên thuộc tính extendedProps (hoặc thêm thuộc tính riêng để phân biệt)
    const isProject = event.extendedProps.isProject; // giả sử có thuộc tính isProject trong extendedProps

    axios.post(`/api/calendar/update-event/${event.id}`, {
        start: event.start,
        end: event.end,
        isProject: isProject,
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error("There was an error updating the event:", error);
      });
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id ? { ...e, start: event.start, end: event.end } : e
        )
      )
    }, [])

  const handleEventResize = useCallback((info) => {
    const { event } = info
    // Kiểm tra loại sự kiện dựa trên thuộc tính extendedProps (hoặc thêm thuộc tính riêng để phân biệt)
    const isProject = event.extendedProps.isProject; // giả sử có thuộc tính isProject trong extendedProps

    axios.post(`/api/calendar/update-event/${event.id}`, {
      start: event.start,
      end: event.end,
      isProject: isProject,
    })
    .then(response => {
      console.log(response.data.message);
    })
    .catch(error => {
      console.error("There was an error updating the event:", error);
    });

    setEvents((prevEvents) =>
      prevEvents.map((e) =>
        e.id === event.id ? { ...e, start: event.start, end: event.end } : e
      )
    )
  }, [])

  const renderEventContent = (eventInfo) => {
    const calendarColors = {
      'to-do': 'bg-blue-400 border-blue-500 shadow-blue-300',
      'in-progress': 'bg-yellow-400 border-yellow-500 shadow-yellow-300',
      'verify': 'bg-red-400 border-red-500 shadow-red-300',
      'done': 'bg-green-400 border-green-500 shadow-green-300',
    };
    
    const backgroundColor = calendarColors[eventInfo.event.extendedProps.status] || 'bg-gray-600 border-gray-700 shadow-gray-300';
  
    return (
      <div className={`${backgroundColor} w-full h-full mb-1 p-2 rounded-lg border text-white shadow-md`}>
        <div className="flex gap-1">
          <p className="text-sm font-medium">{eventInfo.event.title}</p>
          {eventInfo.event.description && (
            <p className="text-xs truncate">{eventInfo.event.description}</p>
          )}
          {eventInfo.event.extendedProps.isLate && (
              <span className="ml-2 px-1 py-0.5 bg-red-700 rounded text-xs">Quá hạn</span>
            )}
            {eventInfo.event.extendedProps.isNearDeadline && !eventInfo.event.extendedProps.isLate && (
              <span className="ml-2 px-1 py-0.5 bg-yellow-700 rounded text-xs">Gần hạn</span>
            )}
          <div className="flex ml-auto gap-1 justify-start items-center">
            <span className="text-xs italic">
             {eventInfo.event.start ? eventInfo.event.start.toLocaleDateString() : ''}
            </span>
            <span>-</span>
            <span className="text-xs italic">
              {eventInfo.event.end ? eventInfo.event.end.toLocaleDateString() : ''}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const todayEvents = events.filter(event => 
    new Date(event.start).toDateString() === new Date().toDateString()
  )

  // useEffect(() => {
  //     if (calendarRef.current && calendarRef.current.getApi) {
  //       const calendarApi = calendarRef.current.getApi()
  //       if (calendarApi && typeof calendarApi.destroy === 'function') {
  //         calendarApi.destroy()
  //       }
  //     }
  // }, [])

  const handleDateSelect = (selectInfo) => {
    setDate(selectInfo.start)
  }

  const handleDateChange = (newDate) => {
  setDate(newDate);
  if (calendarRef.current && calendarRef.current.getApi) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(newDate);
  }
};


  const handleViewChange = (newView) => {
    setCurrentView(newView)
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(newView)
    }
  }

  return (
    <div id='calendar' className="flex h-auto">
      {/* Sidebar */}
      <div className="w-1/4 border-r pr-4 flex flex-col">
       
        <div className="mb-4 relative">
          <SimpleCalendar
            selectedDate={date}
            onChange={handleDateChange}
          />
           <button 
            className="btn-today px-2 rounded absolute right-3 bottom-3" 
            onClick={() => handleDateChange(new Date())}
          >
            to day
          </button>
        </div>
        <div className="menu mb-2 flex gap-2 items-center">
          <h1 className='text-base font-semibold'>Filter: </h1>
          <select
            className="project-dropdown rounded-md text-sm"
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="allproject">All Project</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4 flex-grow">
          <h2 className="font-semibold">Today</h2>
          <ul className="space-y-2">
            {todayEvents.map((event) => (
              <li key={event.id} className="p-2 rounded-md text-sm bg-gray-100">
                <span className="font-medium">{format(new Date(event.start), 'HH:mm')}</span> - {event.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 h-full pt-1 pl-4 flex-grow ">
        <div className="menu flex mb-4">

          <div className="w-full flex items-center">
            <h1 className="text-2xl font-semibold">
              {format(date, "dd MMMM yyyy")}
            </h1>
            <select 
              className="rounded-md ml-2 text-base w-auto" 
              value={currentView} 
              onChange={(e) => handleViewChange(e.target.value)}
            >
              <option value="dayGridMonth">Month</option>
              <option value="timeGridWeek">Week</option>
              <option value="timeGridDay">Day</option>
              <option value="listWeek">List</option>
            </select>
              <button className="btn-meeting flex justify-center items-center px-2 py-2 rounded-md">
                Create meeting
              </button>
          </div>

        </div>

        <div className="h-[calc(100vh-180px)]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={currentView}
            initialDate={date}
            views={{
              timeGridWeek: {
                type: 'timeGrid',
                duration: { days: 7 },
                buttonText: 'week'
              }
            }}
            headerToolbar={false}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            eventContent={renderEventContent}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            select={handleDateSelect}
            eventClassNames={(event) => {
              return ['bg-transparent rounded-md border-none text-sm'];
            }}
            height="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default FullCalendarComponent