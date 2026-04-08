import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900">PeerPrep</span>
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-bold leading-tight tracking-tight text-black">
            Master Technical Interviews with a Peer.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600">
            Collaborative coding, real-time matching, and a curated question bank to help you land your next software engineering role.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full sm:w-auto">
          {/* Link to Login Page */}
          <Link
            href="/auth/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700 md:w-auto"
          >
            Login
          </Link>

          {/* Link to Register Page */}
          <Link
            href="/auth/register"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-zinc-200 px-8 transition-colors hover:bg-zinc-50 md:w-auto"
          >
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}