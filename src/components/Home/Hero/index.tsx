import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
	return (
		<section className='relative z-1 overflow-hidden pb-6 pt-14'>
			<div className='mx-auto w-full max-w-[1170px] px-4 text-center sm:px-8 xl:px-0'>
				<div className='relative mx-auto max-w-[800px]'>
					<h1 className='mb-3 font-satoshi text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-4xl'>
						<span className="block mb-0.5">Professional</span>
						<span className='text-primary'>Website Management</span>
						<span className="block mt-0.5">Service</span>
					</h1>

					<p className='mx-auto mb-4 max-w-[600px] text-sm text-gray-700 dark:text-gray-300 sm:text-base'>
						A complete website management service with all essential features,
						integrations, and tools to maintain and grow your website.
						Focus on your business while your website is expertly managed.
					</p>

					<div className="flex justify-center mb-6">
						<Link
							href='/auth/signin'
							className='inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-satoshi text-sm font-medium text-white transition-all hover:bg-primary-dark sm:px-6'
						>
							Get Started
							<svg
								className='h-3.5 w-3.5'
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

					<div className="text-center">
						<h2 className="text-xl font-bold mb-1.5 text-black dark:text-white">Launch Your Website with Confidence</h2>
						<p className="text-sm text-gray-700 dark:text-gray-300">Everything you need to build, launch, and scale your website.</p>
					</div>
				</div>
			</div>

			{/* <!-- Hero Bg Shapes --> */}
			<div className='sm:block'>
				<div className='absolute left-0 top-0 -z-1 opacity-30 sm:opacity-100'>
					<Image
						src='/images/hero/hero-shape-01.svg'
						alt='shape'
						width={340}
						height={480}
						priority
						className="w-[180px] sm:w-[280px] h-auto"
						sizes="(max-width: 640px) 180px, 280px"
					/>
				</div>
				<div className='absolute right-0 top-0 -z-1 opacity-30 sm:opacity-100'>
					<Image
						src='/images/hero/hero-shape-02.svg'
						alt='shape'
						width={340}
						height={480}
						priority
						className="w-[180px] sm:w-[280px] h-auto"
						sizes="(max-width: 640px) 180px, 280px"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
