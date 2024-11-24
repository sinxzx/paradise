import * as DataHandler from "server/Handlers/DataHandler";
import { Players } from "@rbxts/services";

Players.PlayerAdded.Connect((player) => task.spawn(() => DataHandler.PlayerAdded(player)));
Players.PlayerRemoving.Connect((player) => DataHandler.PlayerRemoving(player));
