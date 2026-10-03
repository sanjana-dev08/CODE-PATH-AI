function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          CodePath AI
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to continue your coding journey
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold">
          Login
        </button>

        <p className="text-center mt-4 text-sm text-gray-500">
          New to CodePath AI? Create an account
        </p>
      </div>
    </div>
  );
}
export default Login;