"use client"

import { useState, useCallback, useEffect } from "react"
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/hooks/useAuth"

/**
 * Custom hook for managing emergency lockdown functionality
 * @returns {Object} Functions and state for emergency lockdown
 */
export function useEmergencyLockdown() {
  const { user } = useAuth()
  const [isLockdownActive, setIsLockdownActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lockdownDetails, setLockdownDetails] = useState(null)

  /**
   * Activates emergency lockdown by locking all doors in the system
   * @returns {Promise<Object>} Result of the operation
   */
  const activateLockdown = useCallback(async () => {
    if (!user) return { success: false, error: "User not authenticated" }

    setIsLoading(true)
    setError(null)

    try {
      // Query all devices with deviceType = "Door"
      const doorsQuery = query(collection(db, "Devices"), where("deviceType", "==", "Door"))
      const doorSnapshot = await getDocs(doorsQuery)

      if (doorSnapshot.empty) {
        const noDoorsError = "No doors found in the system"
        setError(noDoorsError)
        return {
          success: false,
          error: noDoorsError,
        }
      }

      // Track success/failure for each door
      const results = []
      let allSuccessful = true

      // Update each door's status to "Locked"
      const updatePromises = doorSnapshot.docs.map(async (doorDoc) => {
        try {
          await updateDoc(doorDoc.ref, {
            status: "Locked",
          })

          results.push({
            doorId: doorDoc.id,
            doorName: doorDoc.data().deviceName || "Unknown Door",
            success: true,
          })

          return true
        } catch (error) {
          console.error(`Error locking door ${doorDoc.id}:`, error)

          results.push({
            doorId: doorDoc.id,
            doorName: doorDoc.data().deviceName || "Unknown Door",
            success: false,
            error: error.message,
          })

          allSuccessful = false
          return false
        }
      })

      // Wait for all updates to complete
      await Promise.all(updatePromises)

      const resultMessage = allSuccessful
        ? "Emergency lockdown activated - All doors locked"
        : "Partial lockdown - Some doors could not be locked"

      const resultDetails = {
        success: allSuccessful,
        message: resultMessage,
        details: results,
        totalDoors: doorSnapshot.size,
        lockedDoors: results.filter((r) => r.success).length,
      }

      setLockdownDetails(resultDetails)
      setIsLockdownActive(true)

      return resultDetails
    } catch (error) {
      console.error("Error activating emergency lockdown:", error)
      setError(error.message)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  /**
   * Deactivates emergency lockdown by unlocking all doors in the system
   * @returns {Promise<Object>} Result of the operation
   */
  const deactivateLockdown = useCallback(async () => {
    if (!user) return { success: false, error: "User not authenticated" }

    setIsLoading(true)
    setError(null)

    try {
      // Query all devices with deviceType = "Door"
      const doorsQuery = query(collection(db, "Devices"), where("deviceType", "==", "Door"))
      const doorSnapshot = await getDocs(doorsQuery)

      if (doorSnapshot.empty) {
        const noDoorsError = "No doors found in the system"
        setError(noDoorsError)
        return {
          success: false,
          error: noDoorsError,
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
          })

          results.push({
            doorId: doorDoc.id,
            doorName: doorDoc.data().deviceName || "Unknown Door",
            success: true,
          })

          return true
        } catch (error) {
          console.error(`Error unlocking door ${doorDoc.id}:`, error)

          results.push({
            doorId: doorDoc.id,
            doorName: doorDoc.data().deviceName || "Unknown Door",
            success: false,
            error: error.message,
          })

          allSuccessful = false
          return false
        }
      })

      // Wait for all updates to complete
      await Promise.all(updatePromises)

      const resultMessage = allSuccessful
        ? "Emergency lockdown deactivated - All doors unlocked"
        : "Partial unlock - Some doors could not be unlocked"

      const resultDetails = {
        success: allSuccessful,
        message: resultMessage,
        details: results,
        totalDoors: doorSnapshot.size,
        lockedDoors: 0,
      }

      setLockdownDetails(resultDetails)
      setIsLockdownActive(false)

      return resultDetails
    } catch (error) {
      console.error("Error deactivating emergency lockdown:", error)
      setError(error.message)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  /**
   * Gets the current lockdown status by checking if any doors are locked
   */
  const checkLockdownStatus = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Query all devices with deviceType = "Door"
      const doorsQuery = query(collection(db, "Devices"), where("deviceType", "==", "Door"))
      const doorSnapshot = await getDocs(doorsQuery)

      if (doorSnapshot.empty) {
        setIsLockdownActive(false)
        setLockdownDetails({
          success: true,
          isLockdownActive: false,
          message: "No doors found in the system",
          totalDoors: 0,
          lockedDoors: 0,
        })
        return
      }

      // Check if any door is locked
      const lockedDoors = doorSnapshot.docs.filter((doc) => doc.data().status === "Locked")
      const isActive = lockedDoors.length > 0

      const statusDetails = {
        success: true,
        isLockdownActive: isActive,
        totalDoors: doorSnapshot.size,
        lockedDoors: lockedDoors.length,
        message: isActive
          ? `Lockdown active: ${lockedDoors.length} of ${doorSnapshot.size} doors locked`
          : "No lockdown active: All doors unlocked",
      }

      setIsLockdownActive(isActive)
      setLockdownDetails(statusDetails)
    } catch (error) {
      console.error("Error getting lockdown status:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Check lockdown status when component mounts or user changes
  useEffect(() => {
    if (user) {
      checkLockdownStatus()
    }
  }, [user, checkLockdownStatus])

  return {
    isLockdownActive,
    isLoading,
    error,
    lockdownDetails,
    activateLockdown,
    deactivateLockdown,
    checkLockdownStatus,
  }
}

