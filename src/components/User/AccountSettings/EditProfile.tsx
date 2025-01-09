"use client";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getSignedURL } from "@/actions/upload";
import Loader from "@/components/Common/Loader";
import axios from "axios";

// Secure default avatar from UI Avatars - a trusted service that generates avatars from initials
const getDefaultAvatar = (name: string) => {
	const encodedName = encodeURIComponent(name || 'User');
	return `https://ui-avatars.com/api/?name=${encodedName}&background=0D8ABC&color=fff`;
};

export default function EditProfile() {
	const { data: session, update } = useSession();
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	const [data, setData] = useState({
		name: session?.user?.name || "",
		image: session?.user?.image || "",
	});

	const { name, image } = data;

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
			});

			if (res.status === 200) {
				toast.success("Profile updated successfully");
				update();
			}
		} catch (error: any) {
			toast.error(error.response.data);
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.includes("image")) {
			toast.error("Please upload an image file");
			return;
		}

		try {
			setImageLoading(true);
			const { url } = await getSignedURL(file);

			const res = await axios.patch("/api/user", {
				image: url,
			});

			if (res.status === 200) {
				toast.success("Profile image updated successfully");
				update();
				setData({
					...data,
					image: url,
				});
			}
		} catch (error: any) {
			toast.error(error.response.data);
		} finally {
			setImageLoading(false);
		}
	};

	return (
		<Card title='Edit Profile'>
			<form onSubmit={handleSubmit}>
				<div className='mb-5'>
					<label className='mb-2.5 block font-medium text-dark dark:text-white'>
						Profile Photo
					</label>
					<div className='relative h-25 w-25'>
						<Image
							width={100}
							height={100}
							src={image || getDefaultAvatar(name)}
							alt='profile'
							className='h-25 w-25 rounded-full object-cover object-center'
						/>
						<label
							htmlFor='profile'
							className='absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full border border-stroke bg-white hover:bg-opacity-90 dark:border-strokedark dark:bg-boxdark'
						>
							<input
								type='file'
								name='profile'
								id='profile'
								className='sr-only'
								onChange={handleImageUpload}
								accept="image/*"
							/>
							{imageLoading ? (
								<Loader style='border-primary' />
							) : (
								<svg
									className='fill-current duration-300 ease-in-out'
									width='14'
									height='14'
									viewBox='0 0 14 14'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z'
										fill=''
									/>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z'
										fill=''
									/>
								</svg>
							)}
						</label>
					</div>
				</div>

				<div className='mb-5'>
					<InputGroup
						label='Full Name'
						name='name'
						type='text'
						placeholder='Enter your full name'
						value={name}
						handleChange={handleChange}
					/>
				</div>

				<FormButton>
					Save {loading && <Loader style='border-white dark:border-dark' />}
				</FormButton>
			</form>
		</Card>
	);
}
