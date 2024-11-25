import { Players } from "@rbxts/services";
import { RunService } from "@rbxts/services";
import { CollectionService } from "@rbxts/services";
import { InteractionModule } from "./InteractionModules/SharedInteraction";
import SharedInteraction from "./InteractionModules/SharedInteraction";
import Cleanup from "./InteractionModules/Cleanup";

const Player: Player = Players.LocalPlayer;
const Character: Model | undefined = Player.Character;

const InteractionModuleMap: Record<string, () => Promise<{ default: InteractionModule }>> = {
	GasPrompt: () => import("./InteractionModules/GasInteraction"),
};

const activeInstances: BasePart[] = [];

let InteractionParts: Array<Instance>;
let CheckConnection: RBXScriptConnection | undefined;
CheckConnection = RunService.Heartbeat.Connect(async () => {
	if (Character !== undefined && Character.FindFirstChild("HumanoidRootPart") !== undefined) {
		InteractionParts = CollectionService.GetTagged("Interactive");
		for (const instance of InteractionParts) {
			// check distance
			// import function from another ts script and call it depending on the interacitonpart's name
			const HRP = Character?.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
			if (HRP && instance.IsA("BasePart")) {
				const distance = HRP.Position.sub(instance.Position).Magnitude;
				if (distance <= 20 && !activeInstances.includes(instance)) {
					const interactionName = instance.Name;
					activeInstances.push(instance);
					const loadModule = InteractionModuleMap[interactionName];
					if (loadModule) {
						try {
							const { default: InteractionHandler } = await loadModule();
							SharedInteraction(instance);
							InteractionHandler(instance);
						} catch (error) {
							warn(`Failed to load or execute interaction handler for ${interactionName}:`, error);
						}
					} else {
						warn(`No interaction handler found for ${interactionName}`);
					}
				} else if (distance > 20 && activeInstances.includes(instance)) {
					if (instance.IsA("BasePart")) {
						const index = activeInstances.findIndex((part) => part === instance);
						activeInstances.remove(index);
						Cleanup(instance);
					}
				}
			}
		}
	} else {
		CheckConnection?.Disconnect();
		CheckConnection = undefined;
	}
});
