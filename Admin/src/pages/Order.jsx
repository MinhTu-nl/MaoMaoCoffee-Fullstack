import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backEndURL } from '../App'
import { toast } from 'react-toastify'

const Order = ({ token }) => {

    const [orders, setOrders] = useState([])
    const fetchAllOrders = async () => {
        if (!token) return null

        try {
            const res = await axios.post(backEndURL + `/api/order/all`, {}, { headers: { token } })
            console.log(res)

            if (res.data.success) {
                setOrders(res.data.orders)
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            toast.error(e.message)
        }
    }

    useEffect(() => {
        fetchAllOrders()
    }, [token])

    return (
        <div>
            order
        </div>
    )
}

export default Order
