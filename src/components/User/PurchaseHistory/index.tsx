import React from "react";
import PurchaseEmptyState from "./PurchaseEmptyState";
import PurchaseTable from "./PurchaseTable";
import { isAuthorized } from "@/libs/isAuthorized";
import { pricingData } from "@/pricing/pricingData";

const PurchaseHistory = async () => {
	const user = await isAuthorized();
	const purchasedPlan = pricingData.find(
		(plan) => plan.priceId === user?.priceId || plan.yearlyPriceId === user?.priceId
	);

	if (!user) return null;

	const isSubscribed =
		user.priceId &&
		user.currentPeriodEnd &&
		new Date(user.currentPeriodEnd).getTime() + 86_400_000 > Date.now();

	const isYearlyPlan = purchasedPlan?.yearlyPriceId === user?.priceId;

	const data = {
		unit_amount: isYearlyPlan ? purchasedPlan?.yearly_unit_amount : purchasedPlan?.monthly_unit_amount,
		currentPeriodEnd: user?.currentPeriodEnd,
		subscriptionId: user?.subscriptionId,
		nickname: purchasedPlan?.nickname,
	};

	return (
		<>{isSubscribed ? <PurchaseTable data={data} /> : <PurchaseEmptyState />}</>
	);
};

export default PurchaseHistory;
