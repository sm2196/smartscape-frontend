import { db } from "./firebase"
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"

/**
 * Updates the lock status of a door
 * @param {string} doorId - ID of the door to update
 * @param {boolean} locked - Whether the door should be locked (true) or unlocked (false)
 * @returns {Promise<Object>} Result of the operation
 */
export async function updateDoorLockStatus(doorId, locked) {
  try {
    const doorRef = doc(db, "Dashboard", doorId)

    // Update the door status
    await updateDoc(doorRef, {
      isLocked: locked,
      lastUpdated: serverTimestamp(),
    })

    return {
      success: true,
      message: `Door ${doorId} ${locked ? "locked" : "unlocked"}`,
    }
  } catch (error) {
    console.error(`Error updating door ${doorId}:`, error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Gets the current lock status of a door
 * @param {string} doorId - ID of the door to check
 * @returns {Promise<Object>} Current door status
 */
export async function getDoorLockStatus(doorId) {
  try {
    const doorRef = doc(db, "Dashboard", doorId)
    const doorSnap = await getDoc(doorRef)

    if (doorSnap.exists()) {
      return {
        success: true,
        data: doorSnap.data(),
      }
    } else {
      return {
        success: false,
        error: "Door not found",
      }
    }
  } catch (error) {
    console.error(`Error getting door ${doorId}:`, error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Activates emergency lockdown by locking all doors
 * @returns {Promise<Object>} Result of the operation
 */
export async function activateEmergencyLockdown() {
  try {
    // Lock main door
    const mainDoorResult = await updateDoorLockStatus("mainDoor", true)

    // Lock garage door
    const garageDoorResult = await updateDoorLockStatus("garageDoor", true)

    // Check if both operations were successful
    if (mainDoorResult.success && garageDoorResult.success) {
      return {
        success: true,
        message: "Emergency lockdown activated - All doors locked",
      }
    } else {
      // If any operation failed, return error
      return {
        success: false,
        error: "Failed to lock all doors",
        details: {
          mainDoor: mainDoorResult,
          garageDoor: garageDoorResult,
        },
      }
    }
  } catch (error) {
    console.error("Error activating emergency lockdown:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Deactivates emergency lockdown by unlocking all doors
 * @returns {Promise<Object>} Result of the operation
 */
export async function deactivateEmergencyLockdown() {
  try {
    // Unlock main door
    const mainDoorResult = await updateDoorLockStatus("mainDoor", false)

    // Unlock garage door
    const garageDoorResult = await updateDoorLockStatus("garageDoor", false)

    // Check if both operations were successful
    if (mainDoorResult.success && garageDoorResult.success) {
      return {
        success: true,
        message: "Emergency lockdown deactivated - All doors unlocked",
      }
    } else {
      // If any operation failed, return error
      return {
        success: false,
        error: "Failed to unlock all doors",
        details: {
          mainDoor: mainDoorResult,
          garageDoor: garageDoorResult,
        },
      }
    }
  } catch (error) {
    console.error("Error deactivating emergency lockdown:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

