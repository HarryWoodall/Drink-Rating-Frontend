import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia; stub it for the theme provider.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// jsdom doesn't implement EventSource; stub it for hooks that open a stream
// (see src/pages/drink/hooks/useEvents.ts). Never emits — tests that care
// about server events should drive the instance themselves.
class EventSourceStub {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  readonly url: string;
  readonly withCredentials: boolean;
  readyState = EventSourceStub.CONNECTING;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onopen: ((event: Event) => void) | null = null;

  constructor(url: string | URL, init?: EventSourceInit) {
    this.url = String(url);
    this.withCredentials = init?.withCredentials ?? false;
  }

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn(() => true);

  close = vi.fn(() => {
    this.readyState = EventSourceStub.CLOSED;
  });
}

vi.stubGlobal("EventSource", EventSourceStub);

// jsdom implements neither observer; embla-carousel (the ingredient showcase)
// constructs both on mount. Inert stubs — nothing is ever observed.
class ObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal("ResizeObserver", ObserverStub);
vi.stubGlobal("IntersectionObserver", ObserverStub);

// jsdom implements neither pointer capture nor the CSS `transform` property.
// vaul (the shadcn Drawer) treats any pointerdown/up inside the drawer as a
// swipe: it captures the pointer on press and reads the computed transform on
// release, so a plain userEvent.click inside an open drawer would throw.
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();
Element.prototype.hasPointerCapture = vi.fn(() => false);

const getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element, pseudoElement) => {
  const style = getComputedStyle(element, pseudoElement);
  // jsdom reports "" (falsy), so vaul's `transform || webkitTransform || ...`
  // falls through to undefined.
  if (!style.transform) {
    Object.defineProperty(style, "transform", { value: "none" });
  }
  return style;
};
