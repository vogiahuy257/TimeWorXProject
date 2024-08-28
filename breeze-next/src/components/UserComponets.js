'use client'

import { useAuth } from "@/hooks/auth"

const UserComponets = () => {

    const { user } = useAuth({ middleware: 'auth' })

    return(

        <div className="flex items-center">
            
            <div className="text-sm font-medium text-gray-900">
                {user?.name}
            </div>

            <div className="text-sm ml-2 text-gray-900">
                {user?.email}
            </div>

        </div>

    )

}

export default UserComponets