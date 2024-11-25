import { Profile } from "@rbxts/profileservice/globals";
import { ProfileTemplate } from "server/Configs/Data";

class PlayerWrapper {
	private Player: Player;
	private Profile: Profile<ProfileTemplate, unknown>;
	private CharacterAddedListeners: Map<string, (character: Model) => void>;

	public constructor(Player: Player, Profile: Profile<ProfileTemplate, unknown>) {
		this.Player = Player;
		this.Profile = Profile;
		this.CharacterAddedListeners = new Map();
	}

	public addCharacterAddedListener(key: string, listener: (character: Model) => void): void {
		this.CharacterAddedListeners.set(key, listener);
	}

	public removeCharacterAddedListener(key: string): void {
		this.CharacterAddedListeners.delete(key);
	}

	public callCharacterAddedListeners(character: Model): void {
		this.CharacterAddedListeners.forEach((listener) => listener(character));
	}
}

const Wrappers = new Map<Player, PlayerWrapper>();

export function SetupPlayer(Player: Player, Profile: Profile<ProfileTemplate, unknown>) {
	const newWrapper: PlayerWrapper = new PlayerWrapper(Player, Profile);
	Wrappers.set(Player, newWrapper);

	Player.CharacterAdded.Connect((character) => newWrapper.callCharacterAddedListeners(character));
	return newWrapper;
}

export function GetWrapper(Player: Player): PlayerWrapper | undefined {
	return Wrappers.get(Player);
}
