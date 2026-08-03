export interface BaseEvent {
  event: string;
}

export interface RoomEvent extends BaseEvent {
  data: RoomUser[];
}

export type RoomUser = {
  id: string;
  name: string | undefined;
};
