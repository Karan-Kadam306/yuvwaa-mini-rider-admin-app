import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import { CalendarDays, Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";

function RiderActivityPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [previewData, setPreviewData] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [riderActivityData, setRiderActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);

  useEffect(() => {
    setPreviewData([]);
    setUploaded(false);
    fetchRiderActivity(selectedDate); 
  }, [selectedDate]);

  // Fetch Rider Activity Data from selected date
  const fetchRiderActivity = async (date) => {
    setActivityLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/riderActivity?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rider activity data");
      }
      const data = await response.json();
      setRiderActivityData(data);
    } catch (error) {
      setActivityError(error.message);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      const requiredCols = [
        "rider_id",
        "first_name",
        "last_name",
        "mobile",
        "daily_earnings",
      ];

      const isValid = requiredCols.every(col =>
        Object.keys(data[0] || {}).includes(col)
      );

      if (!isValid) {
        alert("❌ Invalid Excel format. Please follow the guide.");
        return;
      }

      setPreviewData(data);
      setUploaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

  // SAVE TO DATABASE
  const saveToDatabase = async () => {
    setLoading(true);
    await fetch("http://localhost:5000/api/riderActivity/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        rows: previewData,
      }),
    });

    setLoading(false);
    alert("✅ Data saved successfully");
  };


  const exportRedZone = () => {
    const red = previewData.filter(r => r.daily_earnings < 2000);
    const ws = XLSX.utils.json_to_sheet(red);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Red Zone Riders");
    XLSX.writeFile(wb, `Red_Zone_${selectedDate}.xlsx`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="p-6">
        <h1 className="text-xl font-bold text-green-800">
          Rider Activity (Excel Upload)
        </h1>

        {/* DATE PICKER */}
        <div className="flex items-center gap-3 mt-4">
          <CalendarDays />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* EXCEL FORMAT GUIDE */}
        <div className="mt-4 p-4 bg-yellow-50 border rounded-lg">
          <p className="font-semibold">Excel Format (Mandatory)</p>
          <ul className="text-sm list-disc ml-5 mt-2">
            <li>rider_id</li>
            <li>first_name</li>
            <li>last_name</li>
            <li>mobile</li>
            <li>daily_earnings</li>
          </ul>
        </div>

        {/* FILE UPLOAD */}
        <div className="mt-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
          />
        </div>

        {/* PREVIEW TABLE */}
        {uploaded && (
          <div className="mt-6 bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Excel Preview</h3>

            <table className="w-full border">
              <thead className="bg-green-100">
                <tr>
                  <td>Name</td>
                  <th>Mobile</th>
                  <th>Earnings</th>
                  <th>Zone</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td>{r.first_name} {r.last_name}</td>
                    <th>{r.mobile}</th>
                    <th>₹{r.daily_earnings}</th>
                    <th className={r.daily_earnings >= 2000 ? "text-green-600" : "text-red-600"}>
                      {r.daily_earnings >= 2000 ? "Green" : "Red"}
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveToDatabase}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save to Database
              </button>

              <button
                onClick={exportRedZone}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Export Red Zone
              </button>
            </div>
          </div>
        )}

        {/* Rider Activity Table (Current selected date) */}
        <div className="mt-6 bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-3">Rider Activity for {selectedDate}</h3>

          {activityLoading ? (
            <div>Loading...</div>
          ) : activityError ? (
            <div className="text-red-600">{activityError}</div>
          ) : riderActivityData.length === 0 ? (
            <div>No data available for this date.</div>
          ) : (
            <table className="w-full border">
              <thead className="bg-green-100">
                <tr>
                  <th>Rider ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Earnings</th>
                  <th>Zone</th>
                </tr>
              </thead>
              <tbody>
                {riderActivityData.map((r, i) => (
                <tr key={i} className="border-t">
                <th>{r.rider_id}</th>
                <th>{r.first_name} {r.last_name}</th>
                <th>{r.mobile}</th>
                <th>₹{r.daily_earnings}</th>
                <th className={r.daily_earnings >= 2000 ? "text-green-600" : "text-red-600"}>
                  {r.daily_earnings >= 2000 ? "Green" : "Red"}
                </th>
                </tr>
              ))}
            </tbody>
            </table>

          )}
        </div>
      </div>
    </div>
  );
}

export default RiderActivityPage;
