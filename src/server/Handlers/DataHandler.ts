import { Players } from "@rbxts/services";

const ProfileTemplate: ProfileTemplate = {
	PlayerData: {
		Name: "...",
		Title: "",
		HairColor: {
			R: 0,
			G: 0,
			B: 0,
		},
		EyeColor: {
			R: 0,
			G: 0,
			B: 0,
		},

		EyeType: "Male1",
		MouthType: "Mouth1",
		Scars: [],
	},
	Inventory: {},
	Attributes: {
		Strength: 1,
		Agility: 1,
		Dexterity: 1,
		Perception: 1,
		Durability: 1,
		Resilience: 1,
		InvestmentPoints: 6,
	},
	Injuries: [],
	Abilities: [],
};

import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { ProfileTemplate } from "server/Configs/Data";

const Data_Version = 0;
const ProfileStore = ProfileService.GetProfileStore(`DATA_VERSION_${Data_Version}`, ProfileTemplate);

const Profiles = new Map<Player, Profile<ProfileTemplate, unknown> | undefined>();

function LoadedProfile(player: Player, profile: Profile<ProfileTemplate, unknown>) {
	print("Loaded profile for player: ", player);
	print(profile);
}

export function PlayerRemoving(player: Player) {
	const profile = Profiles.get(player);
	if (profile) {
		profile.Release();
	}
}

export function PlayerAdded(player: Player) {
	const profile = ProfileStore.LoadProfileAsync(`Player_${player.UserId}`);
	if (profile !== undefined) {
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		profile.ListenToRelease(() => {
			Profiles.delete(player);
			player.Kick("Your data has been released.");
		});

		if (Players.IsAncestorOf(player)) {
			Profiles.set(player, profile);
			LoadedProfile(player, profile);
		}
	}
}

export function GetProfile(player: Player) {
	return Profiles.get(player)?.Data;
}

Players.GetPlayers().forEach((player) => task.spawn(() => PlayerAdded(player)));

// export function GetProfile(player: Player) {
// 	return CachedProfiles[player.Name];
// }
