"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Card from "@/components/Common/Card";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import FormButton from "@/components/Common/Dashboard/FormButton";
import Loader from "@/components/Common/Loader";

export default function SetupPassword() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const response = await fetch("/api/user/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password set successfully");
        router.push("/user");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[525px]">
      <Card>
        <div className="mb-9">
          <h3 className="text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white">
            Set Up Your Password
          </h3>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Please set up a password for your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5.5">
          <InputGroup
            label="New password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={data.password}
            handleChange={handleChange}
            required={true}
          />

          <InputGroup
            label="Confirm password"
            name="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            value={data.confirmPassword}
            handleChange={handleChange}
            required={true}
          />

          <FormButton>
            {loading ? (
              <>
                Setting up <Loader style="border-white" />
              </>
            ) : (
              "Set Password"
            )}
          </FormButton>
        </form>
      </Card>
    </div>
  );
} 