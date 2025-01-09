export interface Price {
	priceId: string;
	yearlyPriceId: string;
	monthly_unit_amount: number;
	yearly_unit_amount: number;
	nickname: string;
	description: string;
	subtitle: string;
	includes: string[];
	icon: string;
	icon2?: string;
	active?: boolean;
	isAddon?: boolean;
}
