import CertificateForm from "@/components/CertificateForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-10">
      <header className="mb-10">
        <h1 className="text-5xl font-bold tracking-wider">VeriCert</h1>
      </header>
      <main className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <CertificateForm />
      </main>
    </div>
  );
}
