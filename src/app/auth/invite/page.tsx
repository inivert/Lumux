import InvitedSignin from "@/components/Auth/InvitedSignin";

export default function InvitePage() {
	return (
		<div className='mx-auto w-full max-w-[400px] px-4 py-10'>
			<div className='mb-7.5 text-center'>
				<h3 className='mb-4 font-satoshi text-heading-5 font-bold text-dark dark:text-white'>
					First Time Sign In
				</h3>
				<p className='text-base dark:text-gray-5'>
					Enter your invited email address to access your account
				</p>
			</div>

			<InvitedSignin />

			<div className='mt-5 text-center'>
				<p className='text-sm text-gray-500 dark:text-gray-400'>
					After signing in, you'll need to set up your password in settings
				</p>
			</div>
		</div>
	);
}
