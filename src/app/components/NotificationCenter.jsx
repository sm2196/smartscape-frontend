"use client"

import { useState } from "react"
import { Bell, X, Check, AlertTriangle, Clock } from "lucide-react"
import { useFirebase } from "@/app/firebase/FirebaseContext"

export default function NotificationCenter() {
  const { notificationHistory, markNotificationAsRead, clearAllNotifications } = useFirebase()
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notificationHistory.filter((n) => !n.read).length

  const toggleOpen = () => setIsOpen(!isOpen)

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={toggleOpen}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={clearAllNotifications} className="clear-all" aria-label="Clear all notifications">
              Clear All
            </button>
          </div>

          <div className="notification-list">
            {notificationHistory.length === 0 ? (
              <div className="empty-notifications">
                <p>No notifications</p>
              </div>
            ) : (
              notificationHistory.map((notification) => (
                <div key={notification.id} className={`notification-item ${notification.read ? "read" : "unread"}`}>
                  <div className="notification-icon">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="notification-details">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      <Clock size={12} />
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="mark-read"
                      aria-label="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <button onClick={toggleOpen} className="close-notifications" aria-label="Close notifications">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

