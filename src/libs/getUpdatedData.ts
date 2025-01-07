const getUpdatedData = async (email: string) => {
	try {
		const res = await fetch("/api/user/fetch-user", {
			method: "POST",
			body: JSON.stringify({
				email,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const updatedUser = await res.json();

		return updatedUser;
	} catch (error) {
		console.log("error in getUpdatedData", error);
	}

	return null;
};

export default getUpdatedData;
