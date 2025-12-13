import { Context } from "../common";
import { Track } from "../top-items/Track";
import { Device } from "./Device";
import { PlaybackActions } from "./PlaybackActions";

export interface CurrentlyPlayingTrackResponse {
  device: Device;
  repeat_state: "off" | "context" | "track";
  shuffle_state: boolean;
  context: Context | null;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: Track | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  actions: PlaybackActions;
}
