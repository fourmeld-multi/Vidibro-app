import { nativePageMetadata } from "@/lib/native-pages/metadata";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NativeLangPage from "@/components/NativeLangPage";
import data from "@/lib/native-pages/es";

export const metadata = nativePageMetadata(data);

export default function EsPage() {
  return (
    <>
      <Navbar />
      <NativeLangPage data={data} />
      <Footer />
    </>
  );
}
