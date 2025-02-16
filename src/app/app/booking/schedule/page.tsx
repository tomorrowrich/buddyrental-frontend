"use client";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { Container, useTheme } from "@mui/material";
import { useCallback, useState } from "react";

import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const DragAndDropCalendar = withDragAndDrop(Calendar);

interface IDEvent {
  id?: number;
  start: string | Date;
  end: string | Date;
  title?: string;
  allDay?: boolean;
}

export default function Page() {
  const theme = useTheme();
  const localizer = momentLocalizer(moment);
  const [myEvents, setMyEvents] = useState<IDEvent[]>([
    {
      id: 1,
      title: "Long Event",
      start: new Date(2025, 1, 10),
      end: new Date(2025, 1, 12),
      allDay: true,
    },
    {
      id: 2,
      title: "Planning Meeting",
      start: new Date(2025, 1, 12, 10, 0, 0),
      end: new Date(2025, 1, 12, 12, 30, 0),
      allDay: false,
    },
    {
      id: 3,
      title: "Team Workshop",
      start: new Date(2025, 1, 13, 9, 0, 0),
      end: new Date(2025, 1, 13, 17, 0, 0),
      allDay: false,
    },
    {
      id: 4,
      title: "Conference",
      start: new Date(2025, 1, 14),
      end: new Date(2025, 1, 15),
      allDay: true,
    },
    {
      id: 5,
      title: "Project Review",
      start: new Date(2025, 1, 15, 14, 0, 0),
      end: new Date(2025, 1, 15, 16, 30, 0),
      allDay: false,
    },
    {
      id: 6,
      title: "Today",
      start: new Date(new Date().setHours(new Date().getHours() - 3)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
      allDay: false,
    },
  ]);

  const moveEvent = useCallback(
    ({
      event,
      start,
      end,
      isAllDay: droppedOnAllDaySlot = false,
    }: EventInteractionArgs<object>) => {
      const { allDay } = event as IDEvent;
      if (!allDay && droppedOnAllDaySlot) {
        (event as IDEvent).allDay = true;
      }
      if (allDay && !droppedOnAllDaySlot) {
        (event as IDEvent).allDay = false;
      }

      setMyEvents((prev: IDEvent[]) => {
        const existing =
          prev.find((ev) => ev.id === (event as IDEvent).id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== (event as IDEvent).id);
        return [
          ...filtered,
          {
            ...existing,
            start,
            end,
            allDay: (event as IDEvent).allDay || false,
          },
        ];
      });
    },
    [setMyEvents],
  );

  const resizeEvent = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ event, start, end }: any) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents],
  );

  return (
    <Container sx={{ padding: 2 }}>
      <div>
        <DragAndDropCalendar
          defaultView={Views.WEEK}
          events={myEvents}
          localizer={localizer}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          popup
          resizable
          showMultiDayTimes
          style={{
            color: theme.palette.primary.main,
          }}
        />
      </div>
    </Container>
  );
}
