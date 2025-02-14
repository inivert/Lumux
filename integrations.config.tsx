const integrations = {
	isOpenAIEnabled: false,
	isMailchimpEnabled: false,
	isAuthEnabled: true,
	isPaymentsEnabled: true,
};

const messages = {
	payment: (
		<div style={{ whiteSpace: "pre-wrap" }}>
			Payment is not enabled. Follow the{" "}
			<a
				href='https://codelumus.com/docs/integrations'
				className='text-primary underline'
				target='_blank'
				rel='noopener noreferrer'
			>
				documentation
			</a>{" "}
			to enable it.
		</div>
	),
	openai: (
		<div style={{ whiteSpace: "pre-wrap" }}>
			OpenAI is not enabled. Follow the{" "}
			<a
				href='https://codelumus.com/docs/integrations'
				className='text-primary underline'
			>
				documentation
			</a>{" "}
			to enable it.
		</div>
	),
	mailchimp: (
		<div style={{ whiteSpace: "pre-wrap" }}>
			Mailchimp is not enabled. Follow the {""}
			<a
				href='https://codelumus.com/docs/integrations'
				className='text-primary underline'
			>
				documentation
			</a>{" "}
			to enable it.
		</div>
	),
	auth: (
		<div style={{ whiteSpace: "pre-wrap" }}>
			Auth is not enabled. Follow the{" "}
			<a
				href='https://codelumus.com/docs/integrations'
				className='text-primary underline'
			>
				documentation
			</a>{" "}
			to enable it.
		</div>
	),
	s3: (
		<div style={{ whiteSpace: "pre-wrap" }}>
			S3 is not enabled. Follow the{" "}
			<a
				href='https://codelumus.com/docs/integrations'
				className='text-primary underline'
				target='_blank'
				rel='noopener noreferrer'
			>
				documentation
			</a>{" "}
			to enable it.
		</div>
	),
};

export const stripeConfig = {
	secretKey: process.env.STRIPE_SECRET_KEY || "",
	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
	webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
};

export { integrations, messages };
