import {
  MdLightbulb,
  MdOutlineLight,
  MdDoorFront,
  MdGarage,
  MdWindPower,
  MdThermostat,
  MdBed,
  MdTv,
  MdTimer,
  MdRecycling,
} from "react-icons/md"
import { LuLamp, LuLampDesk, LuHeater, LuProjector, LuBlinds, LuWashingMachine } from "react-icons/lu"
import { TbAirConditioning } from "react-icons/tb"
import { BsSpeaker } from "react-icons/bs"

// Define device types array
export const DEVICE_TYPES = [
  { value: "Light", label: "Light" },
  { value: "Fan", label: "Fan" },
  { value: "AC", label: "Air Conditioner" },
  { value: "Room_Heater", label: "Room Heater" },
  { value: "Water_Heater", label: "Water Heater" },
  { value: "Bed", label: "Smart Bed" },
  { value: "TV", label: "Television" },
  { value: "Projector", label: "Projector" },
  { value: "Speaker", label: "Speaker" },
  { value: "Blinds", label: "Window Blinds" },
  { value: "Door", label: "Door" },
  { value: "Motion", label: "Motion Sensor" },
  { value: "Freezer", label: "Freezer" },
  { value: "Washer", label: "Washing Machine" },
  { value: "Recycling", label: "Recycle Bin" },
]

// Define device icons mapping
export const DEVICE_ICONS = {
  Light: [
    { name: "MdLightbulb", icon: MdLightbulb, label: "Lightbulb" },
    { name: "MdOutlineLight", icon: MdOutlineLight, label: "Light" },
    { name: "LuLamp", icon: LuLamp, label: "Lamp" },
    { name: "LuLampDesk", icon: LuLampDesk, label: "Desk Lamp" },
  ],
  Door: [
    { name: "MdDoorFront", icon: MdDoorFront, label: "Door" },
    { name: "MdGarage", icon: MdGarage, label: "Garage" },
  ],
  Fan: [{ name: "MdWindPower", icon: MdWindPower, label: "Fan" }],
  AC: [{ name: "TbAirConditioning", icon: TbAirConditioning, label: "Air Conditioner" }],
  Room_Heater: [{ name: "LuHeater", icon: LuHeater, label: "Room Heater" }],
  Water_Heater: [{ name: "MdThermostat", icon: MdThermostat, label: "Water Heater" }],
  Bed: [{ name: "MdBed", icon: MdBed, label: "Smart Bed" }],
  TV: [{ name: "MdTv", icon: MdTv, label: "Television" }],
  Projector: [{ name: "LuProjector", icon: LuProjector, label: "Projector" }],
  Speaker: [{ name: "BsSpeaker", icon: BsSpeaker, label: "Speaker" }],
  Blinds: [{ name: "LuBlinds", icon: LuBlinds, label: "Window Blinds" }],
  Motion: [{ name: "MdTimer", icon: MdTimer, label: "Motion Sensor" }],
  Freezer: [{ name: "MdThermostat", icon: MdThermostat, label: "Freezer" }],
  Washer: [{ name: "LuWashingMachine", icon: LuWashingMachine, label: "Washing Machine" }],
  Recycling: [{ name: "MdRecycling", icon: MdRecycling, label: "Recycle Bin" }],
}

// Get default properties based on device type
export const getDeviceTypeProperties = (deviceType) => {
  switch (deviceType) {
    case "Light":
      return {
        isActive: false,
        status: "Off",
        statusColor: "",
        voltage: Math.floor(Math.random() * (120 - 60 + 1)) + 60,
      }
    case "Fan":
      return {
        isActive: false,
        status: "Off",
        statusColor: "",
        voltage: 75,
      }
    case "AC":
      return {
        isActive: true,
        status: "27°C",
        statusColor: "statusPink",
        voltage: 0,
      }
    case "Room_Heater":
      return {
        isActive: true,
        status: "22°C",
        statusColor: "statusBlue",
        voltage: 1500,
      }
    case "Water_Heater":
      return {
        isActive: true,
        status: "83°C",
        statusColor: "statusPink",
        voltage: 1200,
      }
    case "Bed":
      return {
        isActive: true,
        status: "On",
        voltage: 0,
      }
    case "TV":
      return {
        isActive: true,
        status: "On",
        statusColor: "statusGreen",
        voltage: 150,
      }
    case "Projector":
      return {
        isActive: false,
        status: "Off",
        statusColor: "",
        voltage: 300,
      }
    case "Speaker":
      return {
        isActive: false,
        status: "Off",
        statusColor: "",
        voltage: 30,
      }
    case "Blinds":
      return {
        isActive: false,
        status: "Open",
        voltage: 0,
      }
    case "Door":
      return {
        isActive: false,
        status: "Locked",
        voltage: 0,
      }
    case "Motion":
      return {
        isActive: false,
        notificationsEnabled: true,
        status: "1 hour ago",
        voltage: 5,
      }
    case "Freezer":
      return {
        isActive: true,
        status: "-6.5°C",
        statusColor: "statusBlue",
        volume: 700,
      }
    case "Washer":
      return {
        isActive: true,
        status: "Cycle Complete",
        voltage: 500,
      }
    case "Recycling":
      return {
        isActive: true,
        remindersEnabled: false,
        status: "In 5 Days",
        statusColor: "statusGreen",
        voltage: 0,
      }
  }
}
