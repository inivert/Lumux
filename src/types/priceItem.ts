export type Price = {
	priceId?: string;
	subscriptionId?: string;
	currentPeriodEnd?: Date;
	customerId?: string;
	isSubscribed?: boolean;
	isCanceled?: boolean;
	nickname: string;
	description: string;
	subtitle: string;
	includes: string[];
	icon: string;
	icon2?: string;
	active?: boolean;
	isAddon?: boolean;
  	yearlyPriceId?: string;
	monthly_unit_amount: number;
	yearly_unit_amount: number;
};
