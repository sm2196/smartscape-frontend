"use client"

import { useState, useRef, useEffect } from "react"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { downloadCSV, downloadPDF } from "../utils/ExportData"

export default function ExportOptions({ data, period }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleExport = (exportFn) => {
    exportFn(data, period)
    setIsOpen(false)
  }

  return (
    <div className="export-options" ref={dropdownRef}>
      <div className="export-dropdown">
        <button className="export-button" onClick={toggleDropdown}>
          <Download size={16} />
          <span>Export Data</span>
        </button>
        {isOpen && (
          <div className="export-menu">
            <button onClick={() => handleExport(downloadCSV)} className="export-option">
              <FileSpreadsheet size={16} />
              <span>Download as CSV</span>
            </button>
            <button onClick={() => handleExport(downloadPDF)} className="export-option">
              <FileText size={16} />
              <span>Download as PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

