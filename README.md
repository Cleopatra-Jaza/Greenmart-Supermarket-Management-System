# 🛒 Greenmart — Supermarket Management System

A modern supermarket management system built with React, TypeScript, and Vite. Greenmart aims to simplify supermarket operations through a clean, responsive dashboard and organized management modules.

## ✨ Features

- 📊 **Dashboard** — sales overview, revenue summaries, and business metrics.
- 📦 **Product Management** — organize products, prices, and product information.
- 🏷️ **Category Management** — group products by category.
- 📋 **Inventory Management** — monitor stock levels and low-stock items.
- 🛍️ **Point of Sale (POS)** — manage shopping cart items and calculate totals.
- 🧾 **Sales & Orders** — review sales and order information.
- 👥 **Customer Management** — organize customer records.
- 🚚 **Supplier Management** — maintain supplier information.
- 📈 **Reports** — present business and inventory insights.
- ⚙️ **Settings** — manage application preferences.

> Note: Features depend on the current implementation. Database connectivity, authentication, and transaction persistence must be configured and tested before being considered production-ready.

## 🧰 Tech Stack

- React
- TypeScript
- Vite
- CSS
- npm
- Supabase / PostgreSQL — if configured in the project

## 📁 Project Structure

```text
greenmart/
├── public/
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── format.ts
│   │   ├── inventory.ts
│   │   ├── navigation.ts
│   │   ├── supabase.ts
│   │   └── validators.ts
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tests/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username.

```bash
git clone https://github.com/YOUR_USERNAME/greenmart.git
cd greenmart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

If the project uses Supabase, create a local `.env` file based on `.env.example`.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Use the exact environment variable names expected by your application. Never commit real secrets, service-role keys, or database passwords.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal. The default Vite address is usually:

http://localhost:5173

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## 🔐 Security

- Keep private credentials out of source control.
- Use appropriate Supabase Row Level Security (RLS) policies if Supabase is enabled.
- Validate user input.
- Enforce authorization on protected operations.
- Do not expose service-role keys in frontend code.

## 🧪 Testing

Run the scripts configured in `package.json` to check the application and its tests.

```bash
npm run
```

Use the available test, lint, and build commands. Resolve reported errors before treating the project as production-ready.

## 🗺️ Roadmap

- Complete dashboard and management modules.
- Improve responsive design and accessibility.
- Integrate and validate backend functionality.
- Add automated tests.
- Deploy the application for online access.

## 👩‍💻 Author

**M.M.Fathima Jaza**

GitHub: [@Cleopatra-jaza](https://github.com/Cleopatra-jaza)

## 📄 License

Choose an appropriate open-source license before publishing, such as the MIT License. Add a `LICENSE` file if you intend to distribute the project under that license.
