import React from "react";
import Link from "next/link";

const CallToAction = () => {
	return (
		<section className='relative z-1 overflow-hidden py-17.5 lg:py-22.5 xl:py-27.5'>
			<div className='mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0'>
				<div className='wow fadeInUp rounded-[30px] bg-black py-20 px-4 text-center dark:bg-white/[0.03] sm:px-8 xl:px-0'>
					<h2 className='mx-auto mb-4 max-w-[440px] font-satoshi text-2xl font-bold text-white dark:text-white sm:text-3xl lg:text-heading-2'>
						Transform Your Workflow
					</h2>
					<p className='mx-auto mb-9 max-w-[650px] text-gray-5'>
						Ready to transform your workflow? Experience the power of intelligent automation. Sign up now to begin your journey.
					</p>
					<Link
						href='/auth/signin'
						className='inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-white transition-all hover:bg-primary-dark'
					>
						Get Started
						<svg
							className='h-5 w-5'
							viewBox='0 0 20 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M7.5 5.625C7.15482 5.625 6.875 5.34518 6.875 5C6.875 4.65482 7.15482 4.375 7.5 4.375H15C15.3452 4.375 15.625 4.65482 15.625 5V12.5C15.625 12.8452 15.3452 13.125 15 13.125C14.6548 13.125 14.375 12.8452 14.375 12.5V6.50888L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L13.4911 5.625H7.5Z'
								fill='currentColor'
							/>
						</svg>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default CallToAction;
