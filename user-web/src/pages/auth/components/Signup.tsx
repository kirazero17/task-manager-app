import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";

// Import components
import LoadingSpinner from "src/components/LoadingSpinner";

// Import hooks
import { useAuth } from "src/hooks/useAuth";

// Import types
import type { SignUpUserType } from "src/objects/user/type";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpUserType>();
  const navigate = useNavigate();
  const { signup, isPending } = useAuth();

  const onSubmit: SubmitHandler<SignUpUserType> = (data) => {
    if (isPending) return;

    // Check confirm password
    if (data.confirmedPassword !== data.password) {
      toast.error("Failed to confirm your password");
      return;
    }

    console.log("Data:", data);
    // signup(data);
  };

  return (
    <div className="w-full max-w-[480px] bg-white p-6 rounded-lg border border-blue-700">
      <header>
        <h1 className="font-bold text-4xl">Sign up</h1>
        <p>Let we know you</p>
      </header>
      <hr className="my-3" />
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500">You must enter your email</p>
          )}
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col w-full me-2">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <p className="text-red-500">You must enter your first name</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <p className="text-red-500">You must enter your last name</p>
            )}
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col mb-5">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <p className="text-red-500">You must enter your username</p>
          )}
        </div>
        <div className="flex flex-col mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500">You must enter your password</p>
          )}
        </div>
        <div className="flex flex-col mb-5">
          <label
            htmlFor="confirmedPassword"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Confirm your password
          </label>
          <input
            type="password"
            id="confirmedPassword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("confirmedPassword", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500">You must confirm your password</p>
          )}
        </div>
        <hr className="my-3" />
        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={isPending}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-3 text-center"
          >
            {isPending ? (
              <div className="flex justify-center items-center">
                <LoadingSpinner width="w-4" height="w-4" />
                <span className="ms-3">Wait a few seconds...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
          <p className="text-sm">
            Back to{" "}
            <span
              className="cursor-pointer font-bold underline text-blue-700"
              onClick={() => navigate("/sign-in")}
            >
              sign in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
