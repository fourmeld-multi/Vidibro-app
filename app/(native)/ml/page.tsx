import { nativePageMetadata } from "@/lib/native-pages/metadata";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NativeLangPage from "@/components/NativeLangPage";
import data from "@/lib/native-pages/ml";

export const metadata = nativePageMetadata(data);

export default function MlPage() {
  return (
    <>
      <Navbar />
      <NativeLangPage data={data} />
      <Footer />
    </>
  );
}
