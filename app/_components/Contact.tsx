import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import Link from "next/link";

export default function Contact() {
  return (
    <div className='mb-20'>
      <div className="flex flex-col justify-center mt-8">
        <button className="flex flex-col items-center gap-2">
          <img src="oveja.png" alt="logo ministerio" className="w-12" />
        </button>
        <h3 className="text-xl font-mono">MISIÓN 1-99</h3>
      </div>
      <div className="mt-8">
        <p className="text-sm">Síguenos en nuestras redes sociales dando click a los botones de abajo</p>
        <p>👇🏼</p>
        <div className='flex justify-center gap-3 p-6'>
          <Link href="https://www.tiktok.com/@evangelismo_sin_limites?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok size={24} color='#ffffff' />
          </Link>
          <Link href="https://www.facebook.com/profile.php?id=61560654222711" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook size={24} color="#ffffff" />
          </Link>
          <Link href="https://www.instagram.com/evang.sinlimites_mision1_99/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram size={24} color="#ffffff" />
          </Link>
        </div>
        <div className='flex flex-col justify-center gap-2'>
          <div className='flex justify-center items-center gap-2'>Promotor: Ps. Henry Hinojosa -
            <Link href="https://wa.me/950409839?text=Hola%20somos%20Evangelismo%20sin%20L%C3%ADmites%20misi%C3%B3n%201-99%2C%20en%20que%20podemos%20ayudarte%20" target="_blank" rel="noopener noreferrer" aria-label="Whatsapp" className='flex gap-2'>
              <FaWhatsapp size={24} color="#ffffff" />
              950409839
            </Link>
          </div>
          <div className='flex justify-center items-center gap-2'>Director: Ld. Obed Armando -
            <Link href="https://wa.me/934778965?text=Hola%20somos%20Evangelismo%20sin%20L%C3%ADmites%20misi%C3%B3n%201-99%2C%20en%20que%20podemos%20ayudarte%20" target="_blank" rel="noopener noreferrer" aria-label="Whatsapp" className='flex gap-2'>
              <FaWhatsapp size={24} color="#ffffff" />
              934778965
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}