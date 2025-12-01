import { List } from "../List";
import { Artist } from "./Artist";
import { Track } from "./Track";

export type TopItemResponse = List<Artist> | List<Track>;
