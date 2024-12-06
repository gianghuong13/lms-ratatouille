import { Scheduler } from "@aldabil/react-scheduler";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import axios from "axios";

const Calendar = () => {
  return (
    <div className="flex-1">
        <Scheduler
        view="month"
        events={[
          {
            event_id: 1,
            title: "Event 1",
            start: new Date("2024/12/19 09:30"),
            end: new Date("2024/12/21 10:30"),
          },
          {
            event_id: 2,
            title: "Event 2",
            start: new Date("2025/1/18 10:00"),
            end: new Date("2025/2/19 11:00"),
          },
        ]}
      />
    </div>
      
    
  );
};

export default Calendar;