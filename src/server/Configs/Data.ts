export interface ProfileTemplate {
	PlayerData: {
		Name: string;
		Title: string;

		HairColor: {
			R: number;
			G: number;
			B: number;
		};
		EyeColor: {
			R: number;
			G: number;
			B: number;
		};

		AccessoryStore?: number[] | undefined;
		HairStore?: number[] | undefined;

		EyeType: string;
		MouthType: string;
		Scars: string[];
	};
	Inventory: {
		[ItemName: string]: number;
	};
	Attributes: {
		Strength: number;
		Agility: number;
		Dexterity: number;
		Perception: number;
		Durability: number;
		Resilience: number;

		InvestmentPoints: number;
	};
	Injuries: string[];
	Abilities: string[];
}
