import FooterBrand      from '../footer/FooterBrand'
import FooterLinks      from '../footer/FooterLinks'
import FooterNewsletter from '../footer/FooterNewsletter'
import FooterLegal      from '../footer/FooterLegal'

export default function Footer() {
  return (
    <footer role="contentinfo" className="w-full pt-16 pb-24 px-6 md:px-10 bg-[#2c1810] relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <FooterBrand />
          <FooterLinks />
          <FooterNewsletter />
        </div>
        <FooterLegal />
      </div>
    </footer>
  )
}