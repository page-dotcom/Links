import { redirect } from 'next/navigation';

export default function RegisterRedirect() {
  // Ganti link di bawah ini dengan link referral/shorten url target lo
  const targetUrl = "https://t.ly/register?via=brandy";

  // Langsung lempar user ke target pas halaman diakses
  redirect(targetUrl);

  // Ini gak bakal kelihatan, tapi wajib ada buat komponen React
  return null;
}
