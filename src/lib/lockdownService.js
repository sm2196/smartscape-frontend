import { db } from "./firebase"
import { collection, doc, getDoc, getDocs, updateDoc, setDoc, serverTimestamp } from "firebase/firestore"

// Collection references
const dashboardRef = collection(db, "Dashboard")
const lockdownStatusRef = doc(db, "System", "lockdownStatus")

/**
 * Activates or deactivates emergency lockdown
 * @param {boolean} activate - Whether to activate (true) or deactivate (false) lockdown
 * @returns {Promise<Object>} Result of the operation
 */
export async function setEmergencyLockdown(activate) {
  try {
    // 1. Update lockdown status document
    await setDoc(lockdownStatusRef, {
      active: activate,
      timestamp: serverTimestamp(),
    })

    // 2. Get all devices from Dashboard collection
    const devicesSnapshot = await getDocs(dashboardRef)

    // 3. Update each device status based on lockdown
    const updatePromises = []

    devicesSnapshot.forEach((deviceDoc) => {
      const deviceRef = doc(db, "Dashboard", deviceDoc.id)

      // Turn off all devices during lockdown (or turn them back on when deactivated)
      updatePromises.push(
        updateDoc(deviceRef, {
          isOn: !activate, // Turn off when lockdown is activated, turn on when deactivated
          lastUpdated: serverTimestamp(),
        }),
      )
    })

    // Wait for all updates to complete
    await Promise.all(updatePromises)

    return {
      success: true,
      message: activate ? "Emergency lockdown activated" : "Emergency lockdown deactivated",
      devicesAffected: updatePromises.length,
    }
  } catch (error) {
    console.error("Error setting emergency lockdown:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Gets the current lockdown status
 * @returns {Promise<Object>} Current lockdown status
 */
export async function getLockdownStatus() {
  try {
    const docSnap = await getDoc(lockdownStatusRef)

    if (docSnap.exists()) {
      return {
        success: true,
        data: docSnap.data(),
      }
    } else {
      // Initialize with default if it doesn't exist
      await setDoc(lockdownStatusRef, {
        active: false,
        timestamp: serverTimestamp(),
      })

      return {
        success: true,
        data: { active: false },
      }
    }
  } catch (error) {
    console.error("Error getting lockdown status:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}



