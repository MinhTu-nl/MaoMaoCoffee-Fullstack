import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backEndURL } from '../App'

const User = () => {
    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        try {
            console.log('Fetching users from:', backEndURL + `/api/user/list`)
            const res = await axios.get(backEndURL + `/api/user/list`)
            console.log('API Response:', res.data)
            setUsers(res.data?.users || [])
            console.log('Updated users state:', res.data?.data || [])
        } catch (e) {
            console.log('Error fetching users:', e)
            setUsers([])
        }
    }

    useEffect(() => {
        console.log('Component mounted, fetching users...')
        fetchUsers()
    }, [])

    console.log('Current users state:', users)

    return (
        <>
            <div className='flex flex-col gap-2'>
                {/* --------------- LIST TABLE TITLE -------------- */}
                <div className='hidden md:grid grid-cols-[2fr_3fr_4fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Avatar</b>
                    <b>Name</b>
                    <b>Email</b>
                </div>

                {/* ------------- LIST TABLE DATA--------------- */}
                {
                    users?.map((item, index) => (
                        <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[2fr_3fr_4fr] items-center gap-2 py-1 px-2 border text-sm'>
                            <img className='w-12' src={assets.user_icon} alt="" />
                            <p>{item?.name || 'N/A'}</p>
                            <p>{item?.email || 'N/A'}</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default User
