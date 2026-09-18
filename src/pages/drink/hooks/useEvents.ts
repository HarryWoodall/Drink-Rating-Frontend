import { BaseEvent, RoomEvent, RoomUser } from "@/pages/drink/types/roomEvents";
import { useEffect, useState } from "react";

export type OnEventFunction = {
  eventId: string;
  onEvent: (event: BaseEvent) => void;
};

export function useRoomEvents(url?: string): [RoomUser[], RoomEvent[]] {
  const [events, setEvents] = useState<RoomEvent[]>([]);
  const [users, setUsers] = useState<RoomUser[]>([]);

  useEffect(() => {
    if (!url) return;

    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    eventSource.onmessage = (e) => {
      console.log("message incoming");
      const messageData: RoomEvent = JSON.parse(e.data);
      setUsers(messageData.data);
      setEvents((x) => [...x, messageData]);
    };

    return () => eventSource.close();
  }, [url]);

  return [users, events];
}
