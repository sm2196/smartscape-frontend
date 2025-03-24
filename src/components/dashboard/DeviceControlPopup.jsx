"use client"

import { useState, useEffect } from "react"
import { MdClose, MdAccessTime, MdPerson } from "react-icons/md"
import styles from "./DeviceControlPopup.module.css"

// Device-specific control components
const FanControls = ({ initialSpeed = "Off", onUpdate }) => {
  const speeds = ["Off", "Low", "Medium", "High"]

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Fan Speed</h3>
      <div className={styles.speedControls}>
        {speeds.map((speedOption) => (
          <button
            key={speedOption}
            className={`${styles.speedButton} ${initialSpeed === speedOption ? styles.active : ""}`}
            onClick={() =>
              onUpdate({
                status: speedOption,
                isActive: speedOption !== "Off",
                statusColor: speedOption !== "Off" ? "statusYellow" : "",
              })
            }
          >
            {speedOption}
          </button>
        ))}
      </div>
    </div>
  )
}

const LightControls = ({ initialState = "Off", onUpdate }) => {
  const [isOn, setIsOn] = useState(initialState === "On")
  const [brightness, setBrightness] = useState(initialState === "Off" ? 100 : Number.parseInt(initialState) || 100)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? (brightness === 100 ? "On" : `${brightness}%`) : "Off",
      isActive: newState,
      statusColor: newState ? "statusYellow" : "",
    })
  }

  const handleBrightnessChange = (value) => {
    setBrightness(value)
    if (isOn) {
      onUpdate({
        status: value === 100 ? "On" : `${value}%`,
        isActive: true,
        statusColor: "statusYellow",
      })
    }
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Light Controls</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.sliderContainer}>
        <span>Brightness</span>
        <input
          type="range"
          min="10"
          max="100"
          value={brightness}
          onChange={(e) => handleBrightnessChange(Number.parseInt(e.target.value))}
          className={styles.slider}
          disabled={!isOn}
        />
        <span>{brightness}%</span>
      </div>
    </div>
  )
}

// Update the MotionControls component to simplify the layout
const MotionControls = ({ initialState = "11 minutes ago", onUpdate }) => {
  // Generate random motion events with timestamps
  const [motionEvents, setMotionEvents] = useState([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showAllEvents, setShowAllEvents] = useState(false)

  useEffect(() => {
    // Generate random motion events
    const now = new Date()
    const events = []

    // Create 8 random events within the last 24 hours
    for (let i = 0; i < 8; i++) {
      const minutesAgo = Math.floor(Math.random() * 1440) // Random minutes within 24 hours
      const eventTime = new Date(now.getTime() - minutesAgo * 60000)

      events.push({
        id: i,
        time: eventTime,
        minutesAgo: minutesAgo,
      })
    }

    // Sort by most recent first
    events.sort((a, b) => a.minutesAgo - b.minutesAgo)

    setMotionEvents(events)
  }, [])

  const formatTimeAgo = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(minutes / 1440)
      return `${days} day${days !== 1 ? "s" : ""} ago`
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
    onUpdate({
      status: motionEvents[0] ? formatTimeAgo(motionEvents[0].minutesAgo) : initialState,
      notificationsEnabled: !notificationsEnabled,
    })
  }

  const toggleShowAllEvents = () => {
    setShowAllEvents(!showAllEvents)
  }

  // Display only the first 4 events or all if showAllEvents is true
  const displayedEvents = showAllEvents
    ? motionEvents.filter((e) => e.minutesAgo < 1440) // Only today's events
    : motionEvents.slice(0, 4)

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Motion History</h3>

      <div className={styles.motionSettings}>
        <div className={styles.toggleContainer}>
          <span>Notifications</span>
          <button
            className={`${styles.toggleButton} ${notificationsEnabled ? styles.active : ""}`}
            onClick={handleNotificationsToggle}
          >
            {notificationsEnabled ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div className={styles.motionEventsList}>
        {displayedEvents.map((event) => (
          <div key={event.id} className={styles.motionEvent}>
            <div className={styles.motionEventIcon}>
              <MdAccessTime />
            </div>
            <div className={styles.motionEventDetails}>
              <div className={styles.motionEventTime}>
                {formatTime(event.time)} • {formatTimeAgo(event.minutesAgo)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {motionEvents.filter((e) => e.minutesAgo < 1440).length > 4 && (
        <button className={styles.showMoreButton} onClick={toggleShowAllEvents}>
          {showAllEvents ? "Show less" : "Show more"}
        </button>
      )}

      <div className={styles.motionSummary}>
        <span>Total events today: {motionEvents.filter((e) => e.minutesAgo < 1440).length}</span>
      </div>
    </div>
  )
}

// Add this new RecyclingControls component after the MotionControls component

const RecyclingControls = ({ initialState = "In 5 Days", onUpdate }) => {
  // Generate recycling schedule
  const [schedule, setSchedule] = useState([])
  const [remindersEnabled, setRemindersEnabled] = useState(true)

  // Recycling types with their colors only
  const recyclingTypes = [
    { id: "general", name: "General", color: "#888888" },
    { id: "plastic", name: "Plastic", color: "#3b82f6" },
    { id: "paper", name: "Paper", color: "#10b981" },
    { id: "glass", name: "Glass", color: "#06b6d4" },
    { id: "garden", name: "Garden", color: "#84cc16" },
  ]

  useEffect(() => {
    // Generate a simplified recycling schedule
    const now = new Date()
    const scheduleItems = []

    // Create next 3 recycling days (reduced from 5)
    for (let i = 0; i < 3; i++) {
      // Add days to current date (starting with the days mentioned in initialState)
      const daysToAdd =
        i === 0 ? Number.parseInt((initialState.match(/\d+/) || ["5"])[0]) : 7 + Math.floor(Math.random() * 7)
      const date = new Date(now)
      date.setDate(date.getDate() + (i === 0 ? daysToAdd : scheduleItems[i - 1].daysFromNow + daysToAdd))

      // Randomly select 1-2 recycling types (reduced from 1-3)
      const types = []
      const numTypes = 1 + Math.floor(Math.random() * 2)
      const availableTypes = [...recyclingTypes]

      // Always include general waste for the first collection
      if (i === 0) {
        types.push(recyclingTypes[0])
      } else {
        for (let j = 0; j < numTypes; j++) {
          if (availableTypes.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTypes.length)
            types.push(availableTypes[randomIndex])
            availableTypes.splice(randomIndex, 1)
          }
        }
      }

      scheduleItems.push({
        id: i,
        date: date,
        daysFromNow: Math.round((date - now) / (1000 * 60 * 60 * 24)),
        types: types,
      })
    }

    setSchedule(scheduleItems)
  }, [initialState])

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const handleRemindersToggle = () => {
    setRemindersEnabled(!remindersEnabled)
    onUpdate({
      status: `In ${schedule[0]?.daysFromNow || 5} Days`,
      remindersEnabled: !remindersEnabled,
    })
  }

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.recyclingHeader}>
        <h3 className={styles.controlTitle}>Recycling Schedule</h3>
        <div className={styles.toggleContainer} style={{ margin: 0 }}>
          <button
            className={`${styles.toggleButton} ${remindersEnabled ? styles.active : ""}`}
            onClick={handleRemindersToggle}
          >
            {remindersEnabled ? "Reminders On" : "Reminders Off"}
          </button>
        </div>
      </div>

      {schedule.length > 0 && (
        <div className={styles.compactRecyclingSchedule}>
          {schedule.map((item, index) => (
            <div key={item.id} className={`${styles.compactRecyclingItem} ${index === 0 ? styles.nextCollection : ""}`}>
              <div className={styles.recyclingDateCompact}>
                <span className={styles.dateText}>{formatDate(item.date)}</span>
                <span className={styles.daysText}>{item.daysFromNow} days</span>
              </div>
              <div className={styles.recyclingIconsCompact}>
                {item.types.map((type) => (
                  <span
                    key={type.id}
                    title={type.name}
                    className={styles.recyclingDot}
                    style={{ backgroundColor: type.color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Replace the HeaterControls component with this clean slider version
const HeaterControls = ({ initialTemp = "Off", onUpdate }) => {
  const [isOn, setIsOn] = useState(initialTemp !== "Off")
  const [temperature, setTemperature] = useState(initialTemp === "Off" ? 22 : Number.parseInt(initialTemp) || 22)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? `${temperature}°C` : "Off",
      isActive: newState,
      statusColor: newState ? getStatusColorForTemp(temperature) : "",
    })
  }

  const handleTempChange = (newTemp) => {
    setTemperature(newTemp)
    if (isOn) {
      onUpdate({
        status: `${newTemp}°C`,
        isActive: true,
        statusColor: getStatusColorForTemp(newTemp),
      })
    }
  }

  // Get status color based on temperature
  const getStatusColorForTemp = (temp) => {
    if (temp > 26) return "statusPink"
    if (temp > 22) return "statusYellow"
    return "statusBlue"
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Temperature Control</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.tempSliderContainer}>
        <div className={styles.tempValue}>{temperature}°C</div>

        <div className={styles.tempSlider}>
          <input
            type="range"
            min="16"
            max="30"
            value={temperature}
            onChange={(e) => handleTempChange(Number.parseInt(e.target.value))}
            className={styles.tempSliderInput}
            disabled={!isOn}
          />
        </div>

        <div className={styles.tempRange}>
          <span>16°C</span>
          <span>30°C</span>
        </div>
      </div>
    </div>
  )
}

// Replace the FreezerControls component with this clean slider version
const FreezerControls = ({ initialTemp = "-6.5°C", onUpdate }) => {
  const [isOn, setIsOn] = useState(initialTemp !== "Off")
  const [temperature, setTemperature] = useState(initialTemp === "Off" ? -6.5 : Number.parseFloat(initialTemp) || -6.5)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? `${temperature.toFixed(1)}°C` : "Off",
      isActive: newState,
      statusColor: newState ? "statusBlue" : "",
    })
  }

  const handleTempChange = (newTemp) => {
    setTemperature(newTemp)
    if (isOn) {
      onUpdate({
        status: `${newTemp.toFixed(1)}°C`,
        isActive: true,
        statusColor: "statusBlue",
      })
    }
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Freezer Temperature</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.tempSliderContainer}>
        <div className={styles.tempValue}>{temperature.toFixed(1)}°C</div>

        <div className={styles.tempSlider}>
          <input
            type="range"
            min="-20"
            max="5"
            step="0.5"
            value={temperature}
            onChange={(e) => handleTempChange(Number.parseFloat(e.target.value))}
            className={styles.tempSliderInputCold}
            disabled={!isOn}
          />
        </div>

        <div className={styles.tempRange}>
          <span>-20°C</span>
          <span>5°C</span>
        </div>
      </div>
    </div>
  )
}

// Replace the WaterHeaterControls component with this clean slider version
const WaterHeaterControls = ({ initialTemp = "45°C", onUpdate }) => {
  const [isOn, setIsOn] = useState(initialTemp !== "Off")
  const [temperature, setTemperature] = useState(initialTemp === "Off" ? 45 : Number.parseInt(initialTemp) || 45)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? `${temperature}°C` : "Off",
      isActive: newState,
      statusColor: newState ? getStatusColorForTemp(temperature) : "",
    })
  }

  const handleTempChange = (newTemp) => {
    setTemperature(newTemp)
    if (isOn) {
      onUpdate({
        status: `${newTemp}°C`,
        isActive: true,
        statusColor: getStatusColorForTemp(newTemp),
      })
    }
  }

  // Get status color based on temperature
  const getStatusColorForTemp = (temp) => {
    if (temp > 75) return "statusPink"
    if (temp > 60) return "statusYellow"
    return "statusBlue"
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Water Temperature Control</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.tempSliderContainer}>
        <div className={styles.tempValue}>{temperature}°C</div>

        <div className={styles.tempSlider}>
          <input
            type="range"
            min="30"
            max="90"
            value={temperature}
            onChange={(e) => handleTempChange(Number.parseInt(e.target.value))}
            className={styles.tempSliderInputHot}
            disabled={!isOn}
          />
        </div>

        <div className={styles.tempRange}>
          <span>30°C</span>
          <span>90°C</span>
        </div>
      </div>

      <div className={styles.waterUsageInfo}>
        <div className={styles.waterUsageIcon}>💧</div>
        <div className={styles.waterUsageText}>
          {temperature < 50 ? "Low" : temperature < 70 ? "Medium" : "High"} water usage
        </div>
      </div>
    </div>
  )
}

const TVControls = ({ initialState = "Off", onUpdate }) => {
  const [isOn, setIsOn] = useState(initialState === "On")
  const [volume, setVolume] = useState(30)
  const [source, setSource] = useState("HDMI 1")

  const sources = ["HDMI 1", "HDMI 2", "TV", "Netflix", "YouTube"]

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? "On" : "Off",
      isActive: newState,
      statusColor: newState ? "statusGreen" : "",
    })
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
  }

  const handleSourceChange = (newSource) => {
    setSource(newSource)
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>TV Controls</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.sliderContainer}>
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number.parseInt(e.target.value))}
          className={styles.slider}
          disabled={!isOn}
        />
        <span>{volume}%</span>
      </div>

      <div className={styles.sourceControl}>
        <span>Source</span>
        <div className={styles.sourceButtons}>
          {sources.map((src) => (
            <button
              key={src}
              className={`${styles.sourceButton} ${source === src ? styles.active : ""}`}
              onClick={() => handleSourceChange(src)}
              disabled={!isOn}
            >
              {src}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Auto-close after selection for simple controls
const DoorControls = ({ initialState = "Locked", onUpdate, autoClose }) => {
  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Door Controls</h3>
      <div className={styles.doorControlButtons}>
        <button
          className={`${styles.doorButton} ${initialState === "Locked" ? styles.active : ""}`}
          onClick={() => {
            onUpdate({ status: "Locked" })
            if (autoClose) setTimeout(autoClose, 300)
          }}
        >
          Lock
        </button>
        <button
          className={`${styles.doorButton} ${initialState === "Unlocked" ? styles.active : ""}`}
          onClick={() => {
            onUpdate({ status: "Unlocked" })
            if (autoClose) setTimeout(autoClose, 300)
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  )
}

const BlindsControls = ({ initialState = "Closed", onUpdate }) => {
  const positions = ["Closed", "25% Open", "50% Open", "75% Open", "Open"]

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Blinds Controls</h3>
      <div className={styles.blindsControls}>
        {positions.map((position) => (
          <button
            key={position}
            className={`${styles.blindsButton} ${initialState === position ? styles.active : ""}`}
            onClick={() => onUpdate({ status: position })}
          >
            {position}
          </button>
        ))}
      </div>
    </div>
  )
}

const SpeakerControls = ({ initialState = "Off", onUpdate }) => {
  // Fix: Correctly determine if the speaker is on based on the initialState
  const [isOn, setIsOn] = useState(initialState === "On")
  const [volume, setVolume] = useState(50)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? "On" : "Off",
      isActive: newState,
      // Always use statusPink if battery info exists, otherwise no color
      statusColor: initialState.includes("Battery") ? "" : newState ? "statusPink" : "",
    })
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Speaker Controls</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.sliderContainer}>
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number.parseInt(e.target.value))}
          className={styles.slider}
          disabled={!isOn}
        />
        <span>{volume}%</span>
      </div>

      {initialState.includes("Battery") && (
        <div className={styles.batteryInfo}>
          <span>Battery Level</span>
          <div className={styles.batteryLevel}>
            <div className={styles.batteryFill} style={{ width: initialState.replace(/[^0-9]/g, "") + "%" }}></div>
          </div>
          <span>{initialState}</span>
        </div>
      )}
    </div>
  )
}

const ProjectorControls = ({ initialState = "Off", onUpdate }) => {
  const [isOn, setIsOn] = useState(initialState === "On")
  const [source, setSource] = useState("HDMI")

  const sources = ["HDMI", "USB", "Wireless"]

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onUpdate({
      status: newState ? "On" : "Off",
      isActive: newState,
      statusColor: newState ? "statusGreen" : "",
    })
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Projector Controls</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isOn ? styles.active : ""}`} onClick={handleToggle}>
          {isOn ? "On" : "Off"}
        </button>
      </div>

      <div className={styles.sourceControl}>
        <span>Source</span>
        <div className={styles.sourceButtons}>
          {sources.map((src) => (
            <button
              key={src}
              className={`${styles.sourceButton} ${source === src ? styles.active : ""}`}
              onClick={() => setSource(src)}
              disabled={!isOn}
            >
              {src}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Auto-close after selection for simple controls
const NotificationControls = ({ initialState = "Off", onUpdate, autoClose }) => {
  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Notification Settings</h3>
      <div className={styles.notificationOptions}>
        <button
          className={`${styles.notificationButton} ${initialState === "On" ? styles.active : ""}`}
          onClick={() => {
            onUpdate({
              status: "On",
              isActive: true,
              statusColor: "statusYellow",
            })
            if (autoClose) setTimeout(autoClose, 300)
          }}
        >
          Enable Notifications
        </button>
        <button
          className={`${styles.notificationButton} ${initialState === "Off" ? styles.active : ""}`}
          onClick={() => {
            onUpdate({
              status: "Off",
              isActive: false,
            })
            if (autoClose) setTimeout(autoClose, 300)
          }}
        >
          Disable Notifications
        </button>
      </div>
    </div>
  )
}

// New washing machine controls
const WashingMachineControls = ({ initialState = "Off", onUpdate }) => {
  const [isRunning, setIsRunning] = useState(initialState !== "Off" && initialState !== "Cycle Complete")
  const [selectedCycle, setSelectedCycle] = useState("Normal")

  const cycles = ["Normal", "Quick", "Eco", "Heavy Duty", "Delicate"]
  const actions = ["Start", "Pause", "Spin", "Rinse", "Drain"]

  const handleCycleSelect = (cycle) => {
    setSelectedCycle(cycle)
  }

  const handleAction = (action) => {
    if (action === "Start") {
      setIsRunning(true)
      onUpdate({
        status: `Running: ${selectedCycle}`,
        isActive: true,
      })
    } else if (action === "Pause") {
      setIsRunning(false)
      onUpdate({
        status: "Paused",
        isActive: true,
      })
    } else if (action === "Spin") {
      setIsRunning(true)
      onUpdate({
        status: "Spinning",
        isActive: true,
      })
    } else if (action === "Rinse") {
      setIsRunning(true)
      onUpdate({
        status: "Rinsing",
        isActive: true,
      })
    } else if (action === "Drain") {
      setIsRunning(true)
      onUpdate({
        status: "Draining",
        isActive: true,
      })
      // Simulate cycle completion after draining
      setTimeout(() => {
        setIsRunning(false)
        onUpdate({
          status: "Cycle Complete",
          isActive: true,
        })
      }, 2000)
    }
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>Washing Machine Controls</h3>

      <div className={styles.cycleSelector}>
        <span>Cycle</span>
        <div className={styles.cycleButtons}>
          {cycles.map((cycle) => (
            <button
              key={cycle}
              className={`${styles.cycleButton} ${selectedCycle === cycle ? styles.active : ""}`}
              onClick={() => handleCycleSelect(cycle)}
              disabled={isRunning}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actionButtons}>
        {actions.map((action) => (
          <button
            key={action}
            className={styles.actionButton}
            onClick={() => handleAction(action)}
            disabled={(action === "Start" && isRunning) || (action !== "Start" && !isRunning)}
          >
            {action}
          </button>
        ))}
      </div>

      {isRunning && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <span>Cycle in progress</span>
        </div>
      )}
    </div>
  )
}

const DefaultControls = ({ title, status, onUpdate }) => {
  const [isEnabled, setIsEnabled] = useState(status === "On")

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    onUpdate({
      status: newState ? "On" : "Off",
      isActive: newState,
    })
  }

  return (
    <div className={styles.controlsContainer}>
      <h3 className={styles.controlTitle}>{title} Controls</h3>
      <div className={styles.toggleContainer}>
        <span>Power</span>
        <button className={`${styles.toggleButton} ${isEnabled ? styles.active : ""}`} onClick={handleToggle}>
          {isEnabled ? "On" : "Off"}
        </button>
      </div>
    </div>
  )
}

// Now, let's update the renderControls function to use our new FreezerControls component

// Determine which control component to render based on device type and title
const renderControls = (device, onUpdate, handleClose) => {
  const { title, status, icon } = device
  const iconName = icon.name

  // Motion controls
  if (iconName === "MdTimer" || title.includes("Motion")) {
    return <MotionControls initialState={status} onUpdate={onUpdate} />
  }
  // Fan controls
  else if (iconName === "MdWindPower" || title.includes("Fan")) {
    return <FanControls initialSpeed={status} onUpdate={onUpdate} />
  }
  // Light controls
  else if (
    iconName === "MdLightbulb" ||
    iconName === "LuLamp" ||
    iconName === "LuLampDesk" ||
    iconName === "MdOutlineLight" ||
    title.includes("Light") ||
    title.includes("Lamp")
  ) {
    return <LightControls initialState={status} onUpdate={onUpdate} />
  }
  // Water Heater controls
  else if (title.includes("Water Heater")) {
    return <WaterHeaterControls initialTemp={status} onUpdate={onUpdate} />
  }
  // Freezer controls
  else if (title.includes("Freezer")) {
    return <FreezerControls initialTemp={status} onUpdate={onUpdate} />
  }
  // Temperature controls
  else if (
    iconName === "LuHeater" ||
    iconName === "TbAirConditioning" ||
    iconName === "MdThermostat" ||
    title.includes("Heater") ||
    title.includes("AC") ||
    title.includes("Temp")
  ) {
    return <HeaterControls initialTemp={status} onUpdate={onUpdate} />
  }
  // TV controls
  else if (iconName === "MdTv" || title.includes("TV")) {
    return <TVControls initialState={status} onUpdate={onUpdate} />
  }
  // Door controls - with auto-close
  else if (iconName === "MdDoorFront" || iconName === "MdGarage" || title.includes("Door")) {
    return <DoorControls initialState={status} onUpdate={onUpdate} autoClose={handleClose} />
  }
  // Blinds controls
  else if (iconName === "LuBlinds" || title.includes("Blind")) {
    return <BlindsControls initialState={status} onUpdate={onUpdate} />
  }
  // Speaker controls
  else if (iconName === "BsSpeaker" || title.includes("Speaker") || title.includes("JBL")) {
    return <SpeakerControls initialState={status} onUpdate={onUpdate} />
  }
  // Projector controls
  else if (iconName === "LuProjector" || title.includes("Projector")) {
    return <ProjectorControls initialState={status} onUpdate={onUpdate} />
  }
  // Visitor Log controls
  else if (title.includes("Visitor Log")) {
    return <VisitorLogControls initialState={status} onUpdate={onUpdate} />
  }
  // Washing machine controls
  else if (iconName === "LuWashingMachine" || title.includes("Washing Machine")) {
    return <WashingMachineControls initialState={status} onUpdate={onUpdate} />
  }
  // Recycling controls
  else if (iconName === "MdRecycling" || title.includes("Recycling")) {
    return <RecyclingControls initialState={status} onUpdate={onUpdate} />
  }
  // Default controls for other devices
  else {
    return <DefaultControls title={title} status={status} onUpdate={onUpdate} />
  }
}

export function DeviceControlPopup({ device, onClose, onUpdate }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay to allow animation to work
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  // Check if this is a simple control that should auto-close
  const isSimpleControl = () => {
    const { title, icon } = device
    const iconName = icon.name

    return (
      iconName === "MdDoorFront" ||
      iconName === "MdGarage" ||
      title.includes("Door") ||
      iconName === "MdNotifications" ||
      title.includes("Notification")
    )
  }

  return (
    <>
      <div className={`${styles.overlay} ${isVisible ? styles.visible : ""}`} onClick={handleClose} />
      <div className={`${styles.popup} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.popupHeader}>
          <h2 className={styles.popupTitle}>
            <device.icon className={styles.popupIcon} />
            {device.title}
          </h2>
          {!isSimpleControl() && (
            <button className={styles.closeButton} onClick={handleClose}>
              <MdClose />
            </button>
          )}
        </div>
        <div className={styles.popupContent}>{renderControls(device, onUpdate, handleClose)}</div>
      </div>
    </>
  )
}