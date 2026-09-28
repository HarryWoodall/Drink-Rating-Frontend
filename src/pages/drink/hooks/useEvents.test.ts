import { act, renderHook } from "@testing-library/react";
import { useRoomEvents } from "./useEvents";
import type { RoomEvent } from "../types/roomEvents";

/**
 * Wraps the EventSource stub from src/test/setup.ts so each test can reach the
 * instance the hook opened and push messages through it.
 */
const StubEventSource = globalThis.EventSource;
let opened: EventSource[] = [];

class RecordingEventSource extends StubEventSource {
  constructor(url: string | URL, init?: EventSourceInit) {
    super(url, init);
    opened.push(this);
  }
}

function emit(source: EventSource, event: RoomEvent) {
  act(() => {
    source.onmessage?.(new MessageEvent("message", { data: JSON.stringify(event) }));
  });
}

describe("useRoomEvents", () => {
  beforeEach(() => {
    opened = [];
    vi.stubGlobal("EventSource", RecordingEventSource);
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.stubGlobal("EventSource", StubEventSource);
  });

  it("doesn't open a stream without a URL", () => {
    const { result } = renderHook(() => useRoomEvents(undefined));

    expect(opened).toHaveLength(0);
    expect(result.current).toEqual([[], []]);
  });

  it("opens a credentialed stream to the URL", () => {
    renderHook(() => useRoomEvents("/api/events/cocktail/11007"));

    expect(opened).toHaveLength(1);
    expect(opened[0].url).toBe("/api/events/cocktail/11007");
    expect(opened[0].withCredentials).toBe(true);
  });

  it("replaces the users and accumulates events as messages arrive", () => {
    const { result } = renderHook(() => useRoomEvents("/events"));

    const first: RoomEvent = { event: "join", data: [{ id: "u1", name: "Alex" }] };
    const second: RoomEvent = {
      event: "join",
      data: [
        { id: "u1", name: "Alex" },
        { id: "u2", name: undefined },
      ],
    };

    emit(opened[0], first);
    emit(opened[0], second);

    const [users, events] = result.current;
    expect(users).toEqual(second.data);
    expect(events).toEqual([first, second]);
  });

  it("closes the stream on unmount", () => {
    const { unmount } = renderHook(() => useRoomEvents("/events"));

    unmount();

    expect(opened[0].close).toHaveBeenCalled();
  });

  it("closes the old stream and opens a new one when the URL changes", () => {
    const { rerender } = renderHook(({ url }) => useRoomEvents(url), {
      initialProps: { url: "/events/a" },
    });

    rerender({ url: "/events/b" });

    expect(opened).toHaveLength(2);
    expect(opened[0].close).toHaveBeenCalled();
    expect(opened[1].url).toBe("/events/b");
  });
});
