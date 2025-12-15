"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Employee {
  id: number;
  name: string;
  position: string;
}

interface Shift {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_position: string;
  start_time: string;
  end_time: string;
  role_assigned: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmployee, setFilterEmployee] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loadingPayroll, setLoadingPayroll] = useState(false);

  const [selectedEmployeeForPayroll, setSelectedEmployeeForPayroll] =
    useState<string>("");

  const [payrollData, setPayrollData] = useState<any>(null);

  // Fetch shifts
  const fetchShifts = async () => {
    try {
      const res = await fetch("/api/shifts", { cache: "no-store" });
      const data = await res.json();
      setShifts(data);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees", { cache: "no-store" });
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchShifts();
    fetchEmployees();
  }, []);

  // Delete shift
  const confirmDeleteShift = async () => {
    if (!shiftToDelete) return;
    try {
      const res = await fetch("/api/shifts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shiftToDelete.id }),
      });
      if (res.ok) {
        await fetchShifts();
        setShiftToDelete(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Format datetime for display
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate shift duration in hours
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  // Get date range based on view mode
  const getDateRange = () => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (viewMode === "daily") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (viewMode === "weekly") {
      // Start of week (Monday)
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);

      // End of week (Sunday)
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (viewMode === "monthly") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  };

  // Format date for display
  const formatDateRange = () => {
    const { start, end } = getDateRange();

    if (viewMode === "daily") {
      return start.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (viewMode === "weekly") {
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else {
      return start.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  };

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);

    if (viewMode === "daily") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewMode === "monthly") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }

    setSelectedDate(newDate);
  };
  // Fetch payroll for selected employee and date range
  const fetchPayroll = async (employeeId: string) => {
    if (!employeeId) {
      setPayrollData(null);
      return;
    }

    setLoadingPayroll(true);
    try {
      const { start, end } = getDateRange();
      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];

      const res = await fetch(
        `/api/payroll?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Payroll API Response:", data);
        setPayrollData(data);
      } else {
        console.error("Failed to fetch payroll");
        setPayrollData(null);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
      setPayrollData(null);
    } finally {
      setLoadingPayroll(false);
    }
  };

  // Filter shifts
  const { start: rangeStart, end: rangeEnd } = getDateRange();

  const filtered = shifts.filter((shift) => {
    const shiftDate = new Date(shift.start_time);

    const matchesSearch =
      shift.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.employee_position
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (shift.role_assigned &&
        shift.role_assigned.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEmployee =
      filterEmployee === "" || shift.employee_id.toString() === filterEmployee;

    const matchesDateRange = shiftDate >= rangeStart && shiftDate <= rangeEnd;

    return matchesSearch && matchesEmployee && matchesDateRange;
  });

  // Generate a consistent color for each employee
  const getEmployeeColor = (employeeId: number) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
      "#F8B739",
      "#52B788",
    ];
    return colors[employeeId % colors.length];
  };

  // Convert shifts to timeline data for Gantt chart
  const getTimelineData = () => {
    const rows: any[] = [];

    filtered.forEach((shift) => {
      const startTime = new Date(shift.start_time);
      const endTime = new Date(shift.end_time);

      const startHour = startTime.getHours() + startTime.getMinutes() / 60;
      const endHour = endTime.getHours() + endTime.getMinutes() / 60;

      const dayOfWeek = startTime.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const dateStr = startTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const rowKey = `${shift.employee_name} (${dateStr})`;

      // Calculate segments
      const segments = {
        regularOffset: 0,
        regularDuration: 0,
        overtimeDuration: 0,
        overtimeBeforeDuration: 0,
        overtimeAfterOffset: 0,
        overtimeAfterDuration: 0,
      };

      if (isWeekend) {
        // Weekend: entire shift is overtime
        const totalShiftHours =
          (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        segments.regularOffset = startHour; // Start at actual shift start
        segments.overtimeBeforeDuration = 0; // Not used for weekends
        segments.regularDuration = totalShiftHours; // Show as one continuous bar
        segments.overtimeDuration = 0; // Not used for weekends
        segments.overtimeAfterOffset = 0;
        segments.overtimeAfterDuration = 0;

        rows.push({
          name: rowKey,
          ...segments,
          color: "#FF6B6B", // Red color for weekend
          overtimeColor: "#FF6B6B",
          actualStart: startHour,
          actualEnd: endHour,
          role: shift.role_assigned,
          isWeekend: true,
          hasOvertime: false, // Not needed since whole shift is overtime
        });
      } else {
        // Weekday
        const regularStart = 8; // 8 AM
        const regularEnd = 18; // 6 PM

        // Calculate each time segment
        let overtimeBeforeHours = 0;
        let regularHours = 0;
        let overtimeAfterHours = 0;

        // Overtime BEFORE 8 AM
        if (startHour < regularStart) {
          overtimeBeforeHours = Math.min(endHour, regularStart) - startHour;
        }

        // Regular hours (8 AM - 6 PM)
        const regularOverlapStart = Math.max(startHour, regularStart);
        const regularOverlapEnd = Math.min(endHour, regularEnd);
        if (regularOverlapStart < regularOverlapEnd) {
          regularHours = regularOverlapEnd - regularOverlapStart;
        }

        // Overtime AFTER 6 PM
        if (endHour > regularEnd) {
          overtimeAfterHours = endHour - Math.max(startHour, regularEnd);
        }

        // Build ONE continuous bar using stack "a"
        // Start with offset to the actual shift start
        segments.regularOffset = startHour;

        // If there's overtime before 8 AM, show it first
        segments.overtimeBeforeDuration = overtimeBeforeHours;

        // Then regular hours
        segments.regularDuration = regularHours;

        // Then overtime after 6 PM
        segments.overtimeDuration = overtimeAfterHours;

        // Stack b and c not used for weekdays
        segments.overtimeAfterOffset = 0;
        segments.overtimeAfterDuration = 0;

        rows.push({
          name: rowKey,
          ...segments,
          color: getEmployeeColor(shift.employee_id),
          overtimeColor: "#FFA500",
          actualStart: startHour,
          actualEnd: endHour,
          role: shift.role_assigned,
          isWeekend: false,
          hasOvertime: overtimeBeforeHours > 0 || overtimeAfterHours > 0,
        });
      }
    });

    return rows;
  };

  const timelineData = getTimelineData();

  // DEBUG
  console.log("Timeline Data:", timelineData);

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <AdminSidebar />

      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8">
            Shift Management
          </h1>

          {/* View Mode Tabs */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === mode
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Date Navigator */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate("prev")}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                ← Prev
              </button>
              <span className="text-lg font-semibold text-white min-w-[250px] text-center">
                {formatDateRange()}
              </span>
              <button
                onClick={() => navigateDate("next")}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Next →
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition-all"
              >
                Today
              </button>
            </div>
          </div>

          {/* Search + Filter + Add */}
          <div className="flex justify-between items-center mb-8 gap-4">
            <input
              type="text"
              placeholder="Search shifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id.toString()}>
                  {emp.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold whitespace-nowrap"
            >
              + Add Shift
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 mb-6">Loading shifts...</p>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Add New Shift
              </h2>
              <ShiftForm
                mode="add"
                employees={employees}
                fetchShifts={fetchShifts}
                onSubmitSuccess={() => setShowAddForm(false)}
              />
            </div>
          )}

          {/* Edit Form */}
          {editingShift && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Edit Shift
              </h2>
              <ShiftForm
                mode="edit"
                editingShift={editingShift}
                employees={employees}
                fetchShifts={fetchShifts}
                onSubmitSuccess={() => setEditingShift(null)}
              />
            </div>
          )}

          {/* Timeline View */}
          {!loading && filtered.length > 0 && (
            <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                Shift Timeline
              </h2>

              <div className="bg-black/20 rounded-lg p-4">
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(300, timelineData.length * 60)}
                >
                  <BarChart
                    data={timelineData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff15"
                      vertical={true}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[6, 22]} // 6 AM to 10 PM
                      ticks={[6, 8, 10, 12, 14, 16, 18, 20, 22]}
                      tickFormatter={(value) => {
                        const period = value >= 12 ? "PM" : "AM";
                        const displayHour =
                          value === 0 ? 12 : value > 12 ? value - 12 : value;
                        return `${displayHour}:00 ${period}`;
                      }}
                      stroke="#ffffff"
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#ffffff"
                      width={90}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;

                          const startHour = Math.floor(data.actualStart);
                          const startMin = Math.round(
                            (data.actualStart % 1) * 60
                          );
                          const endHour = Math.floor(data.actualEnd);
                          const endMin = Math.round((data.actualEnd % 1) * 60);

                          return (
                            <div className="bg-black/90 border border-orange-400/50 rounded-lg p-3 text-white shadow-xl">
                              <p className="font-bold text-orange-400">
                                {data.name}
                              </p>
                              <div className="mt-2 text-sm border-t border-white/10 pt-2">
                                <p className="font-medium">
                                  {startHour}:
                                  {String(startMin).padStart(2, "0")} -{" "}
                                  {endHour}:{String(endMin).padStart(2, "0")}
                                </p>
                                <p className="text-gray-300">
                                  Duration:{" "}
                                  {(data.actualEnd - data.actualStart).toFixed(
                                    1
                                  )}
                                  h
                                </p>
                                {data.isOvertime && (
                                  <div className="mt-2 bg-yellow-500/20 border border-yellow-500 rounded px-2 py-1">
                                    <p className="text-yellow-400 font-bold text-xs">
                                      ⚠️ OVERTIME
                                    </p>
                                    <p className="text-yellow-300 text-xs">
                                      {data.overtimeReason}
                                    </p>
                                  </div>
                                )}
                                {data.role && (
                                  <p className="text-gray-300 mt-1">
                                    Role: {data.role}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* 1. Offset to shift start */}
                    <Bar
                      dataKey="regularOffset"
                      stackId="a"
                      fill="transparent"
                    />

                    {/* 2. Overtime BEFORE 8 AM (orange) */}
                    <Bar
                      dataKey="overtimeBeforeDuration"
                      stackId="a"
                      barSize={30}
                      radius={[10, 0, 0, 10]} // Rounded left if it's the start
                    >
                      {timelineData.map((item, index) => (
                        <Cell
                          key={`before-${index}`}
                          fill={
                            item.overtimeBeforeDuration > 0
                              ? "#FFA500"
                              : "transparent"
                          }
                          opacity={0.9}
                        />
                      ))}
                    </Bar>

                    {/* 3. Regular hours (employee color) */}
                    <Bar dataKey="regularDuration" stackId="a" barSize={30}>
                      {timelineData.map((item, index) => (
                        <Cell
                          key={`regular-${index}`}
                          fill={item.color}
                          opacity={0.9}
                        />
                      ))}
                    </Bar>

                    {/* 4. Overtime AFTER 6 PM (orange) */}
                    <Bar
                      dataKey="overtimeDuration"
                      stackId="a"
                      barSize={30}
                      radius={[0, 10, 10, 0]} // Rounded right if it's the end
                    >
                      {timelineData.map((item, index) => (
                        <Cell
                          key={`after-${index}`}
                          fill={
                            item.overtimeDuration > 0
                              ? "#FFA500"
                              : "transparent"
                          }
                          opacity={0.9}
                        />
                      ))}
                    </Bar>

                    {/* Invisible spacer for overtime after */}
                    <Bar
                      dataKey="overtimeAfterOffset"
                      stackId="c"
                      fill="transparent"
                    />

                    {/* Overtime AFTER 6 PM */}
                    <Bar
                      dataKey="overtimeAfterDuration"
                      stackId="c"
                      barSize={30}
                      radius={[0, 10, 10, 0]}
                    >
                      {timelineData.map((item, index) => (
                        <Cell
                          key={`after-${index}`}
                          fill={
                            item.overtimeAfterDuration > 0
                              ? "#FFA500"
                              : "transparent"
                          }
                          opacity={0.9}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  {/* Employee colors */}
                  {Array.from(
                    new Set(
                      timelineData
                        .filter((d) => !d.isOvertime)
                        .map((d) => d.name)
                    )
                  ).map((employeeName) => {
                    const employeeData = timelineData.find(
                      (d) => d.name === employeeName && !d.isOvertime
                    );
                    if (!employeeData) return null;

                    const totalHours = timelineData
                      .filter((d) => d.name === employeeName)
                      .reduce(
                        (sum, d) => sum + (d.actualEnd - d.actualStart),
                        0
                      );

                    return (
                      <div
                        key={employeeName}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div
                          className="w-5 h-5 rounded-full shadow-lg"
                          style={{
                            backgroundColor: employeeData.color,
                            boxShadow: `0 0 10px ${employeeData.color}50`,
                          }}
                        />
                        <span className="text-sm font-medium text-gray-200">
                          {employeeName}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({totalHours.toFixed(1)}h)
                        </span>
                      </div>
                    );
                  })}

                  {/* Overtime indicators */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30">
                    <div
                      className="w-5 h-5 rounded-full shadow-lg"
                      style={{
                        backgroundColor: "#FFA500",
                        boxShadow: "0 0 10px #FFA50050",
                      }}
                    />
                    <span className="text-sm font-medium text-orange-300">
                      Overtime (Before/After)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
                    <div
                      className="w-5 h-5 rounded-full shadow-lg"
                      style={{
                        backgroundColor: "#FF6B6B",
                        boxShadow: "0 0 10px #FF6B6B50",
                      }}
                    />
                    <span className="text-sm font-medium text-red-300">
                      Weekend Overtime
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payroll Summary */}
          <div className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Payroll Summary
            </h2>

            {/* Employee Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Employee
              </label>
              <select
                value={selectedEmployeeForPayroll}
                onChange={(e) => {
                  setSelectedEmployeeForPayroll(e.target.value);
                  fetchPayroll(e.target.value);
                }}
                className="w-full md:w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id.toString()}>
                    #{emp.id} - {emp.name} ({emp.position})
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loadingPayroll && (
              <div className="text-center py-8 text-gray-400">
                Loading payroll data...
              </div>
            )}

            {/* Empty State */}
            {!loadingPayroll && !payrollData && selectedEmployeeForPayroll && (
              <div className="text-center py-8 text-gray-400">
                No shifts found for this employee in the selected date range.
              </div>
            )}

            {/* Payroll Cards */}
            {!loadingPayroll && payrollData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Regular Hours Card */}
                <div className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">
                      Regular Hours
                    </h3>
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {payrollData.regularHours.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    @ ${payrollData.hourlyRate.toFixed(2)}/hr
                  </p>
                </div>

                {/* Overtime Hours Card */}
                <div className="backdrop-blur-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-6 border border-orange-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">
                      Overtime Hours
                    </h3>
                    <svg
                      className="w-6 h-6 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {payrollData.overtimeHours.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    @ ${payrollData.overtimeRate.toFixed(2)}/hr
                  </p>
                </div>

                {/* Total Pay Card */}
                <div className="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300">
                      Total Pay
                    </h3>
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    ${payrollData.totalPay.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    for {formatDateRange()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">Start Time</th>
                  <th className="px-6 py-3">End Time</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Notes</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-6 text-center text-gray-400"
                    >
                      No shifts found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((shift) => (
                    <tr
                      key={shift.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-all"
                    >
                      <td className="px-6 py-4">{shift.employee_name}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {shift.employee_position}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDateTime(shift.start_time)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDateTime(shift.end_time)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {calculateDuration(shift.start_time, shift.end_time)}h
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {shift.role_assigned || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                        {shift.notes || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditingShift(shift)}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShiftToDelete(shift)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {shiftToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the shift for{" "}
              <span className="text-white font-semibold">
                {shiftToDelete.employee_name}
              </span>{" "}
              on {formatDateTime(shiftToDelete.start_time)}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteShift}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setShiftToDelete(null)}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* Shift Form Component */
const ShiftForm = ({
  mode,
  editingShift,
  employees,
  onSubmitSuccess,
  fetchShifts,
}: {
  mode: "add" | "edit";
  editingShift?: Shift;
  employees: Employee[];
  onSubmitSuccess: () => void;
  fetchShifts: () => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    employeeId: editingShift?.employee_id?.toString() || "",
    startTime: editingShift?.start_time
      ? new Date(editingShift.start_time).toISOString().slice(0, 16)
      : "",
    endTime: editingShift?.end_time
      ? new Date(editingShift.end_time).toISOString().slice(0, 16)
      : "",
    roleAssigned: editingShift?.role_assigned || "",
    notes: editingShift?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // Check if shift is overtime
  const isOvertimeShift = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return { isOvertime: false, reasons: [] };

    const start = new Date(startTime);
    const end = new Date(endTime);
    const reasons: string[] = [];

    // Check if weekend
    const dayOfWeek = start.getDay();
    if (dayOfWeek === 0) {
      reasons.push("Sunday (Weekend)");
    } else if (dayOfWeek === 6) {
      reasons.push("Saturday (Weekend)");
    }

    // Check if outside 8 AM - 6 PM
    const startHour = start.getHours();
    const startMinutes = start.getMinutes();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();

    // Convert to decimal hours for comparison
    const startDecimal = startHour + startMinutes / 60;
    const endDecimal = endHour + endMinutes / 60;

    if (startDecimal < 8) {
      reasons.push("Starts before 8:00 AM");
    }
    if (endDecimal > 18) {
      reasons.push("Ends after 6:00 PM");
    }

    return {
      isOvertime: reasons.length > 0,
      reasons: reasons,
    };
  };

  const overtimeCheck = isOvertimeShift(formData.startTime, formData.endTime);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee is required.";
    if (!formData.startTime) newErrors.startTime = "Start time is required.";
    if (!formData.endTime) newErrors.endTime = "End time is required.";

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        newErrors.endTime = "End time must be after start time.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/shifts", {
        method: mode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "add"
            ? {
                employeeId: formData.employeeId,
                startTime: formData.startTime,
                endTime: formData.endTime,
                roleAssigned: formData.roleAssigned,
                notes: formData.notes,
              }
            : {
                id: editingShift?.id,
                employeeId: formData.employeeId,
                startTime: formData.startTime,
                endTime: formData.endTime,
                roleAssigned: formData.roleAssigned,
                notes: formData.notes,
              }
        ),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchShifts();
        onSubmitSuccess();
      } else {
        setApiError(data.error || "Failed to save shift");
      }
    } catch (err) {
      console.error("Error:", err);
      setApiError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {apiError && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
          {apiError}
        </div>
      )}

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Employee</label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className={`w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
            errors.employeeId ? "border-red-500" : ""
          }`}
        >
          <option value="">Select an employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} - {emp.position}
            </option>
          ))}
        </select>
        {errors.employeeId && (
          <span className="text-red-400 text-xs mt-1 animate-fadeIn">
            {errors.employeeId}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Start Time</label>
        <input
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={handleChange}
          className={`w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
            errors.startTime ? "border-red-500" : ""
          }`}
        />
        {errors.startTime && (
          <span className="text-red-400 text-xs mt-1 animate-fadeIn">
            {errors.startTime}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">End Time</label>
        <input
          name="endTime"
          type="datetime-local"
          value={formData.endTime}
          onChange={handleChange}
          className={`w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
            errors.endTime ? "border-red-500" : ""
          }`}
        />
        {errors.endTime && (
          <span className="text-red-400 text-xs mt-1 animate-fadeIn">
            {errors.endTime}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Role (Optional)</label>
        <input
          name="roleAssigned"
          type="text"
          value={formData.roleAssigned}
          onChange={handleChange}
          placeholder="e.g., Mechanic, Front Desk"
          className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-300 mb-1">Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional notes about this shift"
          rows={3}
          className="w-full rounded-lg px-4 py-2 bg-black/40 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold transition-all"
        >
          {mode === "add" ? "Add Shift" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onSubmitSuccess}
          className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
