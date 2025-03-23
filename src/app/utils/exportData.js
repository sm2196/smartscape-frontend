// Function to convert data to CSV format
export function convertToCSV(data, period) {
  // Create CSV header
  let csvContent = "Time Period,Electricity (kWh),Water (m³)\n"

  // Add data rows
  data.forEach((item) => {
    csvContent += `${item.name},${item.electricity},${item.water}\n`
  })

  return csvContent
}

// Function to download data as CSV
export function downloadCSV(data, period) {
  const csvContent = convertToCSV(data, period)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `consumption_data_${period}_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Function to generate PDF (simplified version)
export function downloadPDF(data, period) {
  alert("PDF export functionality would be implemented here with a library like jsPDF or react-pdf")

  // In a real implementation, you would:
  // 1. Format the data for PDF
  // 2. Create a PDF document with charts and tables
  // 3. Trigger the download

  // Example implementation with jsPDF would be:
  /*
  import { jsPDF } from 'jspdf'
  import 'jspdf-autotable'

  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text(`Consumption Report - ${period}`, 14, 22)

  // Add date
  doc.setFontSize(11)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

  // Add table
  const tableColumn = ["Time Period", "Electricity (kWh)", "Water (m³)"]
  const tableRows = data.map(item => [item.name, item.electricity, item.water])

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
  })

  // Save the PDF
  doc.save(`consumption_data_${period}_${new Date().toISOString().split('T')[0]}.pdf`)
  */
}

