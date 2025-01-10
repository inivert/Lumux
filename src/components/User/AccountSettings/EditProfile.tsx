"use client";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserData {
	name: string | null;
	email: string | null;
	websiteName: string | null;
}

interface EditProfileProps {
	initialData: UserData;
}

// Generate avatar from initials using our API
const getDefaultAvatar = (name: string) => {
	const encodedName = encodeURIComponent(name || 'User');
	return `/api/avatar?name=${encodedName}`;
};

export default function EditProfile({ initialData }: EditProfileProps) {
	const { data: session, update } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		name: initialData.name || "",
		websiteName: initialData.websiteName || "",
	});

	const { name, websiteName } = data;

	// Update local state when initialData changes
	useEffect(() => {
		setData({
			name: initialData.name || "",
			websiteName: initialData.websiteName || "",
		});
	}, [initialData]);

	// Periodically refresh the page to get latest data
	useEffect(() => {
		const interval = setInterval(() => {
			router.refresh();
		}, 30000); // Refresh every 30 seconds

		return () => clearInterval(interval);
	}, [router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await axios.patch("/api/user", {
				name,
				websiteName,
			});

			if (res.status === 200) {
				await update(); // Update the session
				router.refresh(); // Refresh the page to update all components
				toast.success("Profile updated successfully");
			}
		} catch (error: any) {
			toast.error(error.response?.data || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className='relative'>
					<div className='relative mx-auto h-[120px] w-[120px] group'>
						<div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-pulse' />
						<div className='relative h-full w-full overflow-hidden rounded-full border-4 border-white dark:border-gray-700 shadow-lg transition-transform duration-300 group-hover:scale-105'>
							<Image
								src={getDefaultAvatar(name)}
								alt={name || "profile"}
								fill
								className='object-cover'
								unoptimized
									priority
							/>
						</div>
					
					</div>
				</div>

				<div className='space-y-6'>
					<div className='relative'>
						<InputGroup
							label='Full Name'
							name='name'
							type='text'
							placeholder='Enter your full name'
							value={name}
							handleChange={handleChange}
							className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
						/>
						<div className="absolute right-3 top-[38px] text-gray-400">
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M8 2V4M16 2V4M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>

					<div className='relative'>
						<InputGroup
							label='Website Name'
							name='websiteName'
							type='text'
							placeholder='Enter your website name'
							value={websiteName}
							handleChange={handleChange}
							className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
						/>
						<div className="absolute right-3 top-[38px] text-gray-400">
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M12 3C14.5013 5.46452 15.9228 8.66283 16 12C15.9228 15.3372 14.5013 18.5355 12 21C9.49872 18.5355 8.07725 15.3372 8 12C8.07725 8.66283 9.49872 5.46452 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>
				</div>

				<div className="flex justify-end pt-4">
					<FormButton
						loading={loading}
						text="Save Changes"
						disabled={!name && !websiteName}
						className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
					/>
				</div>
			</form>
		</Card>
	);
}
