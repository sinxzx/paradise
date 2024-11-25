import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";

const Player = Players.LocalPlayer;
const PlayerGui = Player.WaitForChild("PlayerGui") as PlayerGui;

interface UIprops {
	text: string;
}

class UI extends Roact.Component<UIprops> {
	render() {
		return (
			<screengui ResetOnSpawn={false}>
				<textlabel
					Text={this.props.text}
					TextScaled={true}
					Position={new UDim2(0.4, 0, 0.1, 0)}
					Size={new UDim2(0.2, 0, 0.1, 0)}
					BackgroundTransparency={1}
					Event={{
						MouseEnter: () => print("Entered!"),

						MouseLeave: () => print("Left!"),
					}}
				/>
			</screengui>
		);
	}
}

const elem = <UI text="Hi" />;

Roact.mount(elem, PlayerGui, "UI");
