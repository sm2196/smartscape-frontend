import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore"

/**
 * Activates emergency lockdown by locking all doors in the system
 * @returns {Promise<Object>} Result of the operation
 */
export async function activateEmergencyLockdown() {
  try {
    // Query all devices with deviceType = "Door"
    const doorsQuery = query(collection(db, "Devices"), where("deviceType", "==", "Door"))

    const doorSnapshot = await getDocs(doorsQuery)

    if (doorSnapshot.empty) {
      return {
        success: false,
        error: "No doors found in the system",
      }
    }

    // Track success/failure for each door
    const results = []
    let allSuccessful = true

    // Update each door's status to "Locked"
    const updatePromises = doorSnapshot.docs.map(async (doorDoc) => {
      try {
        await updateDoc(doorDoc.ref, {
          status: "Locked"
        })

        results.push({
          doorId: doorDoc.id,
          doorName: doorDoc.data().deviceName,
          success: true,
        })

        return true
      } catch (error) {
        console.error(`Error locking door ${doorDoc.id}:`, error)

        results.push({
          doorId: doorDoc.id,
          doorName: doorDoc.data().deviceName,
          success: false,
          error: error.message,
        })

        allSuccessful = false
        return false
      }
    })

    // Wait for all updates to complete
    await Promise.all(updatePromises)

    return {
      success: allSuccessful,
      message: allSuccessful
        ? "Emergency lockdown activated - All doors locked"
        : "Partial lockdown - Some doors could not be locked",
      details: results,
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
 * Deactivates emergency lockdown by unlocking all doors in the system
 * @returns {Promise<Object>} Result of the operation
 */
export async function deactivateEmergencyLockdown() {
  try {
    // Query all devices with deviceType = "Door"
    const doorsQuery = query(collection(db, "Devices"), where("deviceType", "==", "Door"))

    const doorSnapshot = await getDocs(doorsQuery)

    if (doorSnapshot.empty) {
      return {
        success: false,
        error: "No doors found in the system",
      }
    }

    // Track success/failure for each door
    const results = []
    let allSuccessful = true

    // Update each door's status to "Unlocked"
    const updatePromises = doorSnapshot.docs.map(async (doorDoc) => {
      try {
        await updateDoc(doorDoc.ref, {
          status: "Unlocked",
          statusColor: "", // Clear color for unlocked status
          lastUpdated: serverTimestamp(),
        })

        results.push({
          doorId: doorDoc.id,
          doorName: doorDoc.data().deviceName,
          success: true,
        })

        return true
      } catch (error) {
        console.error(`Error unlocking door ${doorDoc.id}:`, error)

        results.push({
          doorId: doorDoc.id,
          doorName: doorDoc.data().deviceName,
          success: false,
          error: error.message,
        })

        allSuccessful = false
        return false
      }
    })

    // Wait for all updates to complete
    await Promise.all(updatePromises)

    return {
      success: allSuccessful,
      message: allSuccessful
        ? "Emergency lockdown deactivated - All doors unlocked"
        : "Partial unlock - Some doors could not be unlocked",
      details: results,
    }
  } catch (error) {
    console.error("Error deactivating emergency lockdown:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Gets the current lockdown status by checking if any doors are locked
 * @returns {Promise<Object>} Current lockdown status
 */
export async function getLockdownStatus() {
  try {
    // Query all devices with deviceType = "Door"
    const doorsQuery = query(collection(db, "Devices"), where("deviceType", "==", "Door"))

    const doorSnapshot = await getDocs(doorsQuery)

    if (doorSnapshot.empty) {
      return {
        success: true,
        isLockdownActive: false,
        message: "No doors found in the system",
      }
    }

    // Check if any door is locked
    const lockedDoors = doorSnapshot.docs.filter((doc) => doc.data().status === "Locked")

    return {
      success: true,
      isLockdownActive: lockedDoors.length > 0,
      totalDoors: doorSnapshot.size,
      lockedDoors: lockedDoors.length,
      message:
        lockedDoors.length > 0
          ? `Lockdown active: ${lockedDoors.length} of ${doorSnapshot.size} doors locked`
          : "No lockdown active: All doors unlocked",
    }
  } catch (error) {
    console.error("Error getting lockdown status:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}



