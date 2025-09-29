export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Authentication Error
        </h1>
        <p className="mt-3 text-2xl">
          There was an error authenticating your account. Please try again.
        </p>
      </main>
    </div>
  )
}
