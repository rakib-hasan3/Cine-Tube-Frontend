// components/Footer/index.tsx
import Link from "next/link";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { GiThunderBlade } from "react-icons/gi";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                                CT
                            </div>
                            <span className="text-xl font-black tracking-tighter text-gray-900">
                                Cine<span className="text-indigo-600">Tube</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Experience the future of media streaming. Watch, discover, and enjoy unlimited content from anywhere in the world.
                        </p>
                        <div className="flex items-center gap-4 text-gray-400">
                            <Link href="#" className="hover:text-indigo-600 transition-colors"><FaFacebook className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-indigo-600 transition-colors"><BsTwitter className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-indigo-600 transition-colors"><BsInstagram className="w-5 h-5" /></Link>
                            <Link href="#" className="hover:text-indigo-600 transition-colors"><GiThunderBlade className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li><Link href="/media" className="hover:text-indigo-600 transition-colors">Browse Media</Link></li>
                            <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing Plans</Link></li>
                            <li><Link href="/trending" className="hover:text-indigo-600 transition-colors">Trending Now</Link></li>
                            <li><Link href="/new-releases" className="hover:text-indigo-600 transition-colors">New Releases</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li><Link href="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4 font-medium">Get the latest updates and movie news.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm"
                            />
                            <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        © {currentYear} CineTube. Built by <span className="text-indigo-600">Rakib</span>
                    </p>
                    <div className="flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Link href="#" className="hover:text-gray-900 transition-colors">Status</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">Security</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}