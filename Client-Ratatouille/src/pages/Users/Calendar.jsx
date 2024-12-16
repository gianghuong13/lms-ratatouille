import { Scheduler } from "@aldabil/react-scheduler";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const userID = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoursesAndAssignments = async () => {
      try {
        const coursesResponse = await fetch(`/api/users-courses/${userID}`);
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");

        const courses = await coursesResponse.json();

        const assignmentsPromises = courses.map(async (course) => {
          const assignmentsResponse = await fetch(
            `/api/assignment/get-assignment-info/${course.course_id}`
          );
          if (!assignmentsResponse.ok) throw new Error("Failed to fetch assignments");

          const assignments = await assignmentsResponse.json();

          return assignments.map((assignment) => ({
            event_id: assignment.assignment_id,
            title: assignment.title,
            start: new Date(assignment.start_date),
            end: new Date(assignment.due_date),
            description: `/${role}/courses/${course.course_id}/assignments/${assignment.assignment_id}`,
          }));
        });

        const assignments = await Promise.all(assignmentsPromises);
        const allEvents = assignments.flat();
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching courses and assignments:", error);
      }
    };

    fetchCoursesAndAssignments();
  }, [userID, role]);

  // Thêm điều hướng khi nhấn vào sự kiện
  const handleEventClick = (event) => {
    const link = event.description; // Đường dẫn đã lưu trong description
    window.open(link, "_blank"); // Mở đường dẫn trong tab mới
  };

  return (
    <div className="flex-1">
      <Scheduler
        view="month"
        events={events}
        onEventClick={handleEventClick} // Xử lý click sự kiện
      />
    </div>
  );
};

export default Calendar;
