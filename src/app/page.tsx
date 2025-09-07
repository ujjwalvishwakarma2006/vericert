import CertificateForm from "@/components/CertificateForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">VeriCert</h1>
        <CertificateForm />
      </div>
    </main>
  );
}
