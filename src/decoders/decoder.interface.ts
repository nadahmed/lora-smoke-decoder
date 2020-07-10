export enum ButtonStatus {
	Normal = 'Normal',
	Test = 'Test',
	Silenced = 'Silenced',
}

export interface JDSD51Status {
	type?: {
		name?: string;
		value?: number;
	};
	isSmokeDetected?: boolean;
	isFaulty?: boolean;
	isLowBattery?: boolean;
	isTampered?: boolean;
	buttonStatus?: ButtonStatus;
}

export interface AN102Status {
	type?: {
		name?: string;
		value?: number;
	};
	frame?: {
		name?: string;
		value?: number;
	};
	smokeDensity?: number;
	temperature?: number;
	humidity?: number;
	batteryLevel?: number;
	alarm?: {
		isSmoke?: boolean;
		isHighTemp?: boolean;
		isLowBattery?: boolean;
	};
	failure?: {
		isDevice?: boolean;
		isTempHumid?: boolean;
		isSelfChecking?: boolean;
	};
	opticalMazePollutionRating?: number;
	wirelessModuleVoltage?: number;
}
