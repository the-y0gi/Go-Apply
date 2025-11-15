"use client"

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function NotificationRefresh() {
  const pathname = usePathname()

  useEffect(() => {
    const refreshNotifications = () => {
      window.dispatchEvent(new CustomEvent('refreshNotifications'))
    }
    
    refreshNotifications()
  }, [pathname])

  return null
}