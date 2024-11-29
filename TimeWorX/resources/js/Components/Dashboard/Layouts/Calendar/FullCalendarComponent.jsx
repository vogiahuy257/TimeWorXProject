import React, { useState, useCallback, useEffect, useRef } from 'react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MeetingForm from '../Meeting/MeetingForm'
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

function FullCalendarComponent({ auth , callCreateToken}) {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('allproject')
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const calendarRef = useRef(null)

  const [meetings, setMeetings] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); 

  const handleOpenFormCreateMeeting = () => {
        setCurrentMeeting(null);
        setIsFormOpen(!isFormOpen);
    };

    const handleEditMeeting = (meeting) => {
        setCurrentMeeting(meeting);
        setIsFormOpen(true);
    };

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
      setEvents(prevEvents => [...prevEvents, ...mappedEvents]);
      setProjects(projectData.projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const getDataMeeting = () => {
    callCreateToken();
      axios.get('/api/meetings')
      .then(response => {
        const meetingsData = response.data;

        const mappedEvents = meetingsData.map((task) => ({
          id: task.meeting_id,
          title: task.meeting_name,
          start: new Date(task.updated_at).toISOString(), // Chuyển đổi thành ISO 8601
          end: new Date(task.meeting_date).toISOString(),
          meeting_time: task.meeting_time,
          description: task.meeting_description,
          created_by: task.creator.name,
          type:"meeting"
        }))
        setEvents(mappedEvents);

        setMeetings(response.data);
          
      })
      .catch(error => {
          console.error('Error fetching meetings:', error);
      });
  }

  useEffect(() => {
    getDataMeeting();
  }, [auth.user]);

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
        setEvents(prevEvents => [...prevEvents, ...mappedEvents]);
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

    if(event.type_event == 'meeting') return;

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
    if(event.type_event == 'meeting') return;
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
      <div className={`${backgroundColor} w-full h-full mb-1 rounded-md border text-white shadow-md`}>
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

  const todayEvents = events.filter(event => {
    const now = new Date(); // Lấy thời gian hiện tại
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); // Bắt đầu ngày hôm nay (00:00:00)
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Kết thúc ngày hôm nay (23:59:59)
  
    const eventStart = new Date(event.start); // Thời gian bắt đầu của sự kiện
    const eventEnd = new Date(event.end); // Thời gian kết thúc của sự kiện
  
    // Kiểm tra nếu sự kiện nằm trong khoảng thời gian của hôm nay
    return (
      (eventStart >= todayStart && eventStart <= todayEnd) || // Bắt đầu trong hôm nay
      (eventEnd >= todayStart && eventEnd <= todayEnd) || // Kết thúc trong hôm nay
      (eventStart <= todayStart && eventEnd >= todayEnd) // Bao trùm cả ngày hôm nay
    )&& !(event.type && event.type === 'meeting');
  });
  

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
      <div className="w-1/4 max-h-[590px] overflow-auto border-r p-2 pr-4 flex flex-col scrollbar-hide">
       
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
        <div className="menu mb-4 flex gap-2 items-center">

          <h1 className='text-base font-semibold'>Filter: </h1>
          <select
            className="project-dropdown rounded-md text-sm w-full"
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="allproject">All Project</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                Task to {project.project_name}
              </option>
            ))}
          </select>
        </div>
        {todayEvents && selectedProjectId !== 'allproject' && (
          <div className="p-4 space-y-2 flex-grow rounded-lg border border-gray-300 shadow-lg">
            <h2 className="font-base text-base">Today Task</h2>
            <ul className="p-2 space-y-3 max-h-[150px] overflow-auto scrollbar-hide">
              {todayEvents.map((event) => (
                <li key={event.id} className="flex items-center p-3 rounded-md text-sm shadow-md border border-gray-300">
                  <span className="font-medium ">{format(new Date(event.start), 'HH:mm')}</span> - 
                  <span className="font-medium ">{format(new Date(event.end), 'HH:mm')}</span> 
                  <span className="ml-auto">{event.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {meetings && (
          <div className='p-4 mt-4 space-y-2 flex-grow rounded-lg border border-gray-300 shadow-lg'>
            <h2 className="font-base text-base">Your Meeting</h2>
                      {meetings.length === 0 ? (
                            <p className='mx-auto mt-[38%] px-4 py-2 rounded-md'>Không có cuộc họp nào.</p>
                        ) : (
                            <ul className="p-3 meeting-list w-full flex flex-col h-auto overflow-y-auto max-h-[230px] scrollbar-hide rounded-xl sm:max-h-[500px]">
                                {meetings.map((meeting) => (
                                    <li key={meeting.meeting_id} className="meeting-item w-full border rounded-xl pt-2 p-4 mb-2 shadow">
                                        <button 
                                            className='flex flex-col w-full relative'
                                            onClick={() => handleEditMeeting(meeting)}
                                        >

                                                <h3 className="text-base font-semibold mb-1">{meeting.meeting_name}</h3>

                                                <div className=" flex items-center text-sm mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
                                                    <p className='ml-1'> {format(new Date(meeting.meeting_date), 'dd-MM-yyyy')} - {format(new Date(`${format(new Date(meeting.meeting_date), 'yyyy-MM-dd')}T${meeting.meeting_time}.000000Z`), 'hh:mm a')}</p>
                                                </div>

                                            {/* <p className="text-sm">description: {meeting.meeting_description || 'Không có mô tả.'}</p> */}
                                            <div className="flex items-center text-sm">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.4635 11.3199C11.7859 11.2527 11.978 10.9152 11.8178 10.6274C11.4645 9.99297 10.908 9.43544 10.1961 9.01056C9.27918 8.46335 8.15577 8.16675 7.00007 8.16675C5.84436 8.16675 4.72095 8.46335 3.80407 9.01055C3.09215 9.43543 2.53563 9.99296 2.18238 10.6274C2.02214 10.9152 2.21419 11.2527 2.53667 11.3199C5.48064 11.9334 8.51949 11.9334 11.4635 11.3199Z" fill="currentColor"/>
                                                    <circle cx="6.99992" cy="4.66667" r="2.91667" fill="currentColor"/>
                                                </svg>
                                                <p className='ml-1'>Create by:  {meeting.creator.name}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
          </div>
        )}

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
              <button onClick={handleOpenFormCreateMeeting} className="btn-meeting flex justify-center items-center px-2 py-2 rounded-md">
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
      {isFormOpen && (
                <MeetingForm styles={"z-50"} onClose={handleOpenFormCreateMeeting} auth={auth} meeting={currentMeeting} callCreateToken = {callCreateToken} getData = {getDataMeeting}/>
            )}
    </div>
  )
}

export default FullCalendarComponent