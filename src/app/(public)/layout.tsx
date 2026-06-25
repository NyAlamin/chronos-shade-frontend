import AnnouncementBar from "@/components/public/announcement-bar";
import Navbar from "@/components/public/navbar";
import Footer from "@/components/public/footer";
import CartDrawer from "@/components/public/cart-drawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}