# 💸 Budgetly — Simplify Your Finances ✨

**Budgetly** is your go-to web app for tracking expenses, managing savings, and keeping your finances in check — all with a clean, interactive interface that’s easy and fun to use. No more messy spreadsheets or lost receipts — Budgetly’s here to help you take control of your money, one transaction at a time! 💰

---

## ✨ Features

- **🔐 Secure Authentication** — Seamless sign up and sign in with Clerk for a fast and protected experience.
- **📅 Date Range Picker** — Filter expenses and budgets by custom date ranges, months, or years.
- **💰 Multi-Category Budgets** — Set monthly or yearly spending goals per category and monitor them in real time.
- **📊 Radial Budget Charts** — Quickly visualize budget usage with interactive radial charts for each category.
- **🧾 Receipt Scanning** — **Upload a receipt image and let AI auto-extract the amount, date, and description.** No manual data entry!
- **📈 Overview Dashboard** — See a quick summary of your income, expenses, and remaining budgets at a glance.
- **🕓 Transaction History** — Browse, filter, and search all your past transactions in one place.
- **⚡ Fast & Responsive** — Powered by Next.js (App Router), React Query, and Tailwind CSS for a super smooth experience.
- **🌗 Dark Mode** — Toggle between light and dark themes for easy-on-the-eyes browsing.
- **🔔 Budget Warnings** — Get instant alerts if a new transaction would exceed your budget limits.
- **🌍 Multi-Currency Support** — Pick your preferred currency for all transactions and budgets.

---

## 🧠 Tech Stack

| Layer         | Tech |
|---------------|-----|
| **Frontend**   | Next.js (App Router), React, Tailwind CSS |
| **Backend**    | Railway (PostgreSQL), Prisma (ORM) |
| **Auth**       | Clerk |
| **Data Fetch** | React Query (TanStack Query) |
| **Validation** | Zod |
| **Icons**      | Lucide Icons |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

---

## 📂 Project Structure
```
expense-tracker/
  app/                # Next.js app directory (pages, API routes, components)
  components/         # Reusable UI components
  hooks/              # Custom React hooks
  lib/                # Utility functions and helpers
  prisma/             # Prisma schema and migrations
  public/             # Static assets
  schema/             # Zod schemas for validation
  .env.local          # Environment variables (never commit this!)
  ...
```
---

## ⚙️ Getting Started

### 🔧 Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** database
- **Clerk account** for authentication
- **Vercel account** (optional, for deployment)
- **Railway account** (optional, for deployment)

---

### 🐣 Backend Setup
1. Clone the repository:
   ```
   git clone https://github.com/your-username/budgetly.git
   cd budgetly
   ```
2. Go to the prisma/ directory and configure your DATABASE_URL in .env.local:
```
DATABASE_URL=postgresql://username:password@your-railway-url/dbname
```
3. Run migrations:
```
npx prisma migrate dev
```
## 🎨 Frontend Setup
1. Go to the app directory:
```
cd app
```
2. Install dependencies:
```
npm install
```
3. Create a .env.local file:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
4. Start the app:
```
npm run dev
```
Your app will be live at http://localhost:3000 🎉

## 🚀 Deployment
# 🌐 Backend (Railway)
1. Push your code to GitHub.

2. Create a new service on Railway.

3. Set the root directory to the project’s backend (project root if it contains main.py or main.js).

4. Configure environment variables (DATABASE_URL, etc.).

5. Deploy and note your public backend URL.

# 🎯 Frontend (Vercel)
1. Push the frontend code to GitHub.

2. Import your repo into Vercel.

3. Set the build command:
```
npm run build
```
4. Set the environment variable NEXT_PUBLIC_API_URL to your backend’s public URL.

5. Deploy and enjoy your live app!

## 📜 License
MIT License — See the [LICENSE](LICENSE) file for more details.

---

## 🤝 Contributing
Contributions are welcome!  
Feel free to open issues or submit pull requests to make Budgetly even better.

---

## 💬 Contact
Have questions or suggestions?  
Reach out or raise an issue — let’s make money management fun & easy together! 🎉

---

Happy budgeting! 🎯💸
