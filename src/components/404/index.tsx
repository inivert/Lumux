import Link from "next/link";
import Image from "next/image";

const NotFound = () => {
	return (
		<section className='relative z-10 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]'>
			<div className='container'>
				<div className='flex flex-wrap items-center justify-center'>
					<div className='w-full px-4'>
						<div className='mx-auto flex max-w-[530px] flex-col items-center justify-center text-center'>
							<div className='mb-7.5 flex h-[200px] w-[200px] items-center justify-center rounded-full bg-primary/5'>
								<svg
									width='50'
									height='50'
									viewBox='0 0 50 50'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M25 37.5C31.9037 37.5 37.5 31.9037 37.5 25C37.5 18.0964 31.9037 12.5 25 12.5C18.0964 12.5 12.5 18.0964 12.5 25C12.5 31.9037 18.0964 37.5 25 37.5Z'
										stroke='#0E172B'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M33.3332 21.9515C33.3332 23.6774 32.4004 25.0765 31.2498 25.0765C30.0992 25.0765 29.1665 23.6774 29.1665 21.9515C29.1665 20.2256 30.0992 18.8265 31.2498 18.8265C32.4004 18.8265 33.3332 20.2256 33.3332 21.9515Z'
										fill='#0E172B'
									/>
									<path
										d='M20.8332 21.9515C20.8332 23.6774 19.9004 25.0765 18.7498 25.0765C17.5992 25.0765 16.6665 23.6774 16.6665 21.9515C16.6665 20.2256 17.5992 18.8265 18.7498 18.8265C19.9004 18.8265 20.8332 20.2256 20.8332 21.9515Z'
										fill='#0E172B'
									/>
								</svg>
							</div>

							<h1 className='mb-5 text-heading-4 font-bold -tracking-[1.6px] text-black dark:text-white lg:text-heading-2'>
								Page not found
							</h1>

							<p className='mx-auto mb-10 w-full max-w-[355px]'>
								The page you are looking for doesn't exist. Here are some helpful
								links:
							</p>

							<div className='flex flex-wrap items-center justify-center gap-3'>
								<Link
									href='/'
									className='inline-flex items-center gap-2 rounded-full border border-stroke bg-white px-6 py-3 font-medium text-black duration-200 ease-out hover:bg-gray'
								>
									<svg
										className='fill-current'
										width='21'
										height='21'
										viewBox='0 0 21 21'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M9.27544 4.63472C9.51952 4.8788 9.51952 5.27452 9.27544 5.5186L5.34238 9.45166H17.1668C17.512 9.45166 17.7918 9.73148 17.7918 10.0767C17.7918 10.4218 17.512 10.7017 17.1668 10.7017H5.34238L9.27544 14.6347C9.51952 14.8788 9.51952 15.2745 9.27544 15.5186C9.03136 15.7627 8.63563 15.7627 8.39155 15.5186L3.39155 10.5186C3.14748 10.2745 3.14748 9.8788 3.39155 9.63472L8.39155 4.63472C8.63563 4.39064 9.03136 4.39064 9.27544 4.63472Z'
										/>
									</svg>
									Go back
								</Link>

								<Link
									href='/'
									className='inline-flex rounded-full bg-primary px-7 py-3 font-medium text-white hover:bg-primary-dark'
								>
									Take me home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NotFound;
