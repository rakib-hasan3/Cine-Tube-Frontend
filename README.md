# Cine-Tube Frontend

Cine-Tube is a modern, feature-rich movie and media streaming platform frontend. Built with the latest web technologies including Next.js 16, React 19, TypeScript, and Tailwind CSS, it offers a seamless and responsive user experience for both regular users and administrators.

## 🔗 Links

- **Live Application:** [Cine-Tube Live](https://cine-tube-gamma.vercel.app)
- **Backend Repository:** [Cine-Tube-backend](https://github.com/rakib-hasan3/Cine-Tube-backend)
- **Developer Portfolio:** [Rakib Hasan](https://rakibhasan-dev.vercel.app)

## 🚀 Features

- **Modern & Responsive UI:** Crafted with Tailwind CSS, Shadcn UI, and Framer Motion for sleek, dynamic animations.
- **Authentication & Authorization:** Secure user login and registration with role-based access control (User vs. Admin).
- **Admin Dashboard:** Comprehensive tools to manage media content, moderate user reviews, handle user accounts, and adjust application settings.
- **Media Browsing:** Explore a wide variety of movies and series with detailed metadata and dedicated watch pages.
- **Personalized Watchlist:** Users can easily save and manage their favorite media to watch later.
- **Subscription Plans:** Integrated Stripe payment gateway for seamless subscription management and premium access.
- **Optimized Performance:** Efficient data fetching and state management powered by React Query and Redux/Zustand.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI, Radix UI
- **Animations:** Framer Motion
- **Data Fetching:** React Query (@tanstack/react-query), Axios
- **State Management:** Redux / Zustand
- **Payments:** Stripe (@stripe/stripe-js)
- **Notifications:** Sonner, SweetAlert2
- **Icons:** Lucide React, React Icons

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-frontend-repo-url>
   cd cine-tube-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your required environment variables (e.g., API endpoints, Stripe public keys).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

- `app/` - Next.js App Router containing route groups:
  - `(admin)` - Admin dashboard, media/user management, and settings.
  - `(auth)` - Login and registration pages.
  - `(common)` - Home, media browsing, pricing, and watchlists.
  - `(dashboard)` - User profile and payment success pages.
- `components/` - Reusable UI components and layout structures.
- `lib/` - Utility functions and configurations.
- `hooks/` - Custom React hooks.
- `providers/` - Context providers (Theme, React Query, etc.).

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request or open an Issue for any bugs or feature requests.

---

*Designed and developed by [Rakib Hasan](https://rakibhasan-dev.vercel.app).*
