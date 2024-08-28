'use client'

import axios from "@/lib/axios";
import useSWR from "swr";

const DisplayFruit = () => {

    const { data: fruits, error } = useSWR('/api/fruits', () =>
        axios
            .get('/api/fruits')
            .then(res => res.data)
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    router.push('/verify-email')
                } else {
                    console.error('Error fetching fruits:', error)
                }
                throw error
            })
    )

    if (error) return <div>Error loading fruits</div>
    if (!fruits) return <div>Loading...</div>

    return (
        <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">
                <p>Your fruit:</p>  
                {fruits?.map((fruits,index)=>(
                    <div key={index}>
                        <p>{fruits.id}</p>
                        <p>{fruits.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DisplayFruit;
