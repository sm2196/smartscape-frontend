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
import { LuHeater, LuLamp, LuLampDesk, LuProjector, LuWashingMachine, LuBlinds  } from "react-icons/lu";
import { BsSpeaker } from "react-icons/bs";
import { TbAirConditioning } from "react-icons/tb";
import { FaPowerOff } from "react-icons/fa6";
import { DeviceCard } from "./DeviceCard"
import { RoomSection } from "./RoomSection"
import styles from "./DashboardContent.module.css"

const bedroomDevices = {
  "Master Bedroom": [
    { icon: LuBlinds, title: "Blinds", status: "Closed"},
    { icon: MdDoorFront, title: "Door", status: "Locked" },
    { icon: LuLampDesk, title: "Bedside Lamp", status: "Off" },
  ],
  "Guest Bedroom": [
    { icon: MdLightbulb, title: "Main Light", status: "Off" },
    { icon: TbAirConditioning, title: "AC", status: "22°C", statusColor: "statusBlue" },
  ],
  "Kids Bedroom": [
    { icon: MdLightbulb, title: "Night Light", status: "On",isActive: true, statusColor: "statusYellow" },
    { icon: MdBed, title: "Smart Bed", status: "Occupied" },
    { icon: LuLampDesk , title: "Study Lamp", status: "Off" },
  ],
}

export default function DashboardContent() {
  const [selectedBedroom, setSelectedBedroom] = useState("Master Bedroom")
  return (
    <>
      <RoomSection title="Living Room">
        <DeviceCard icon={LuLamp} title="Lamp" status="Off" />
        <DeviceCard icon={LuHeater} title="Heater" status="Off" />
        <DeviceCard icon={MdWindPower} title="Ceiling Fan" status="Low" isActive statusColor="statusYellow" />
        <DeviceCard icon={MdOutlineLight} title="Pendant Lights" status="Off" />
        <DeviceCard icon={MdTv} title="SONY TV" status="On" isActive statusColor="statusGreen" />
        <DeviceCard icon={BsSpeaker} title="JBL GO 4" status="52% Battery" statusColor="statusPink" />
        <DeviceCard icon={LuProjector} title="Epson Projector" status="Off" />
      </RoomSection>

      <RoomSection title="Garage">
        <DeviceCard icon={MdGarage} title="Garage Door" status="Closed" />
        <DeviceCard icon={MdThermostat} title="Freezer Temp" status="-6.5°" statusColor="statusBlue" />
        <DeviceCard icon={MdLightbulb} title="Lights" status="Off" />
        <DeviceCard icon={MdRecycling} title="Recycling Day" status="In 5 Days" statusColor="statusGreen" />
        <DeviceCard icon={LuWashingMachine} title="Washing Machine" status="Cycle Complete" isActive />
      </RoomSection>

      <RoomSection title={selectedBedroom} rooms={Object.keys(bedroomDevices)} handleRoomChange={setSelectedBedroom}>
        {bedroomDevices[selectedBedroom].map((device, index) => (
          <DeviceCard
            key={index}
            icon={device.icon}
            title={device.title}
            status={device.status}
            isActive={device.isActive}
            statusColor={device.statusColor}
          />
        ))}
      </RoomSection>

      <RoomSection title="Front Door">
        <DeviceCard icon={MdTimer} title="Last Motion" status="11 minutes ago" />
        <DeviceCard icon={MdDoorFront} title="Front Door" status="Locked" />
        <DeviceCard icon={MdNotifications} title="Notifications" status="On" isActive statusColor="statusYellow" />
      </RoomSection>

      {/* Add padding div for action bar */}
      <div className={"tw:pb-7 tw:max-sm:pb-14"} />

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