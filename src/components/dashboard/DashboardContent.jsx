"use client"

import { useState } from "react"
import {
  MdLightbulb,
  MdTv,
  MdRecycling,
  MdDoorFront,
  MdTimer,
  MdNotifications,
  MdThermostat,
  MdGarage,
  MdWindPower,
  MdBed,
  MdOutlineLight,
} from "react-icons/md"
import { LuHeater, LuLamp, LuLampDesk, LuProjector, LuWashingMachine, LuBlinds } from "react-icons/lu"
import { BsSpeaker } from "react-icons/bs"
import { TbAirConditioning } from "react-icons/tb"
import { FaPowerOff } from "react-icons/fa6"
import { DeviceCard } from "./DeviceCard"
import { RoomSection } from "./RoomSection"
import styles from "./DashboardContent.module.css"

const bedroomDevices = {
  "Master Bedroom": [
    { id: "master_blinds", icon: LuBlinds, title: "Blinds", status: "Closed" },
    { id: "master_door", icon: MdDoorFront, title: "Door", status: "Locked" },
    { id: "master_lamp", icon: LuLampDesk, title: "Bedside Lamp", status: "Off" },
  ],
  "Guest Bedroom": [
    { id: "guest_light", icon: MdLightbulb, title: "Main Light", status: "Off" },
    { id: "guest_ac", icon: TbAirConditioning, title: "AC", status: "22°C", statusColor: "statusBlue" },
  ],
  "Kids Bedroom": [
    {
      id: "kids_nightlight",
      icon: MdLightbulb,
      title: "Night Light",
      status: "On",
      isActive: true,
      statusColor: "statusYellow",
    },
    { id: "kids_bed", icon: MdBed, title: "Smart Bed", status: "Occupied" },
    { id: "kids_lamp", icon: LuLampDesk, title: "Study Lamp", status: "Off" },
  ],
}

export function DashboardContent() {
  const [selectedBedroom, setSelectedBedroom] = useState("Master Bedroom")

  return (
    <>
      <RoomSection title="Living Room">
        <DeviceCard id="living_lamp" icon={LuLamp} title="Lamp" status="Off" />
        <DeviceCard id="living_heater" icon={LuHeater} title="Heater" status="Off" />
        <DeviceCard
          id="living_fan"
          icon={MdWindPower}
          title="Ceiling Fan"
          status="Low"
          isActive
          statusColor="statusYellow"
        />
        <DeviceCard id="living_lights" icon={MdOutlineLight} title="Pendant Lights" status="Off" />
        <DeviceCard id="living_tv" icon={MdTv} title="SONY TV" status="On" isActive statusColor="statusGreen" />
        <DeviceCard
          id="living_speaker"
          icon={BsSpeaker}
          title="JBL GO 4"
          status="52% Battery"
          statusColor="statusPink"
        />
        <DeviceCard id="living_projector" icon={LuProjector} title="Epson Projector" status="Off" />
      </RoomSection>

      <RoomSection title="Garage">
        <DeviceCard id="garage_door" icon={MdGarage} title="Garage Door" status="Closed" />
        <DeviceCard
          id="garage_freezer"
          icon={MdThermostat}
          title="Freezer Temp"
          status="-6.5°C"
          statusColor="statusBlue"
        />
        <DeviceCard id="garage_lights" icon={MdLightbulb} title="Lights" status="Off" />
        <DeviceCard
          id="garage_recycling"
          icon={MdRecycling}
          title="Recycling Day"
          status="In 5 Days"
          statusColor="statusGreen"
        />
        <DeviceCard
          id="garage_washer"
          icon={LuWashingMachine}
          title="Washing Machine"
          status="Cycle Complete"
          isActive
        />
      </RoomSection>

      <RoomSection title={selectedBedroom} rooms={Object.keys(bedroomDevices)} handleRoomChange={setSelectedBedroom}>
        {bedroomDevices[selectedBedroom].map((device) => (
          <DeviceCard
            key={device.id}
            id={device.id}
            icon={device.icon}
            title={device.title}
            status={device.status}
            isActive={device.isActive}
            statusColor={device.statusColor}
          />
        ))}
      </RoomSection>

      <RoomSection title="Front Door">
        <DeviceCard id="front_motion" icon={MdTimer} title="Last Motion" status="11 minutes ago" />
        <DeviceCard id="front_door" icon={MdDoorFront} title="Front Door" status="Locked" />
        <DeviceCard
          id="front_notifications"
          icon={MdNotifications}
          title="Notifications"
          status="On"
          isActive
          statusColor="statusYellow"
        />
      </RoomSection>

      <div className={styles.actionBar}>
        <button className={styles.actionButton}>
          <FaPowerOff />
          Turn Off All Lights and Fans
        </button>
        <button className={styles.actionButton}>
          <MdTv />
          Turn Off TV and Speakers
        </button>
      </div>
    </>
  )
}