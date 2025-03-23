"use client"

import { useState, useEffect } from "react"
import { MdClose } from "react-icons/md"
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
      // Preserve battery status in the status if it exists
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

  // Fan controls
  if (iconName === "MdWindPower" || title.includes("Fan")) {
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
  // Notification controls - with auto-close
  else if (iconName === "MdNotifications" || title.includes("Notification")) {
    return <NotificationControls initialState={status} onUpdate={onUpdate} autoClose={handleClose} />
  }
  // Washing machine controls
  else if (iconName === "LuWashingMachine" || title.includes("Washing Machine")) {
    return <WashingMachineControls initialState={status} onUpdate={onUpdate} />
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