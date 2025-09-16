<p align="center">
  <a href="https://commerce.nuxt.dev">
    <img alt="NuxtCommerce - Headless storefront for Woocommerce" src="https://github.com/user-attachments/assets/1c6720b7-5aea-4f6b-be55-8944fb81799a">
  </a>

  <h1 align="center">NuxtCommerce</h2>

  <p align="center">
    An open-source, dynamic e-commerce solution powered by Nuxt 3 and Supabase. Featuring a user interface in the style of Pinterest and fully customizable (Vue, Nuxt3).
    <br />
    <br />
    <a href="https://commerce.nuxt.dev"><strong>🚀 Live Demo</strong></a>
  </p>
</p>

## We Love Our Stars ⭐⭐⭐⭐⭐

Thanks to the following people who have given us a star on our repo:
[![Stargazers repo roster for @zackha/nuxtcommerce](https://reporoster.com/stars/dark/zackha/nuxtcommerce#gh-dark-mode-only)](https://github.com/zackha/nuxtcommerce/stargazers)

## Introduction

NuxtCommerce is a dynamic and lively e-commerce platform developed with Nuxt 3. It uses Supabase for data and auth, stands out with its Pinterest-style user-friendly interface and fashion-oriented structure. With its dark mode feature and open-source nature, it offers flexibility and continuous development opportunities.

If your product stocks and prices are not changeable, and you are not continuously uploading new products, it could be beneficial for you to opt for [Woonuxt](https://github.com/scottyzen/woonuxt#readme). This project, developed by [scottyzen](https://github.com/scottyzen), is static, thus providing a faster solution.

## Stack

- Nuxt3 / Vue
- Headless Storefront
- GraphQL with Apollo Client
- NUXT UI / Tailwind CSS
- Pinterest Interface
- Supabase-backed
- Dynamic
- Open Source
- Suitable for Fashion Category
- Dark Mode
- UI Lab

## Installation

To get started with NuxtCommerce, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/nuxtcommerce.git
   cd nuxtcommerce
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

   ```sh
   pnpm install
   ```

3. **Set up environment variables:**

   Create a .env file in the root directory and add the following variables:

   ```sh
   NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```

4. **Run the development server:**

   ```sh
   pnpm run dev
   ```

   Your application should now be running on [http://localhost:3000](http://localhost:3000).

### Data mode

This project uses Supabase. If Supabase env vars are missing, some routes will return empty results.

## Data Setup

Create a `products` table in Supabase and seed a few products. See the Supabase section below for schema.

## Supabase Setup

You can run the storefront against a free Supabase project.

1. Environment variables (create `.env` in project root):

```
NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
# Leave GQL_HOST undefined to use Supabase (or mock if Supabase is not configured)
# GQL_HOST=
```

2. Database table (SQL):

```sql
create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  description text not null,
  price numeric not null,
  category text not null,
  material text,
  image text not null,
  featured boolean not null default false,
  inserted_at timestamp with time zone default now()
);

alter table public.products enable row level security;
create policy "Public read products" on public.products for select using (true);
```

3. Seed a few products (UI or SQL) and store image URLs in the `image` column.

4. Run dev server:

```
pnpm install
pnpm run dev
```

Routing priority:

- If `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_ANON_KEY` are set → Supabase mode
- Else → Minimal empty data

## Contributing

Contributions of any kind are welcome! You can open an issue for requests, bug reports, or general feedback, or you can directly create a pull request(PR).

## Contact

Don't hesitate to get in touch if you have any questions or suggestions:

Email: zckhtln@icloud.com</br>
Twitter: [@ZHatlen](https://twitter.com/ZHatlen)
