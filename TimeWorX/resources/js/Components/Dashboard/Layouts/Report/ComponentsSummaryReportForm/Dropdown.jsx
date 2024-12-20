import React, { useState } from 'react';
import '../css/Dropdown.css';

const Dropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (projectId) => {
    onChange(projectId)
    console.log(options);
    setIsOpen(false)
  }

  return (
    <div className="relative custom_drop_down">
      <label htmlFor="project" className="text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className={`custom_button relative w-full cursor-pointer border border-gray-300 rounded-md shadow-sm px-2 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center w-full">
            {options.find(opt => opt.project_id === value) ? (
              <>
                <span 
                  className={`h-2 w-2 rounded-full ml-1 ${options.find(opt => opt.project_id === value)?.project_status}`}
                />
                <span className="ml-3 truncate">
                  {options.find(opt => opt.project_id === value)?.project_name}
                </span>
                <svg className={` ${isOpen ? 'active':''} ml-auto`} xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                    <path d="M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11.5-27.5T268-613q11-11 28-11t28 11l156 155 156-155q11-11 27.5-11.5T692-613q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z"/>
                </svg>
              </>
            ) : (
              <span className="ml-2 truncate">Select a project</span>
            )}
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <div className="h-5 w-5 rounded-full" aria-hidden="true" />
          </span>
        </button>

        {isOpen && (
          <ul
            className={`custom-ul scrollbar-hide absolute z-10 mt-1 w-full shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm`}
            tabIndex={-1}
            role="listbox"
          >
            {options.length > 0 ? (
              options.map((project) => (
                <li
                  key={project.project_id}
                  className={`cursor-default select-none my-2 mx-2 rounded-lg relative py-2 pl-3 ${
                    project.project_id === value ? 'active' : ''
                  }`}
                  onClick={() => handleSelect(project.project_id)}
                  role="option"
                  aria-selected={project.project_id === value}
                >
                  <div className="flex items-center relative">
                    <span 
                      className={` h-2 w-2 rounded-full ${project.project_status}`}
                    />
                    <span className={`ml-3 truncate ${project.project_id === value ? 'font-medium' : 'font-normal'}`}>
                      {project.project_name}
                    </span>
                    <div className='custom_completed_task flex items-center ml-auto mr-2'>
                        <svg className='mr-1' xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                            <path d="m437-355-56-56q-6-6-13-9t-14.5-3q-7.5 0-15 3t-13.5 9q-12 12-12 28.5t12 28.5l85 86q6 6 13 8.5t15 2.5q8 0 15-2.5t13-8.5l169-169q12-12 12-29t-12-29q-12-12-29-12t-29 12L437-355ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h287q16 0 30.5 6t25.5 17l194 194q11 11 17 25.5t6 30.5v447q0 33-23.5 56.5T720-80H240Zm280-560v-160H240v640h480v-440H560q-17 0-28.5-11.5T520-640ZM240-800v200-200 640-640Z"/>
                        </svg>
                        <span className=' text-xs'>
                            {project.completed_tasks_ratio}
                        </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
                No projects available
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dropdown

