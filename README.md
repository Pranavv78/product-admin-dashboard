# 🚀 Product Admin Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
</p>

<p align="center">

### 🚀 LIVE DEMO

<a href="https://product-admin-dashboard-qn6qno8ww-pranav-chavan.vercel.app/login">
  <strong>https://product-admin-dashboard-qn6qno8ww-pranav-chavan.vercel.app/login</strong>
</a>

<br>

### 💻 GITHUB REPOSITORY

<a href="https://github.com/Pranavv78/product-admin-dashboard">
  <strong>https://github.com/Pranavv78/product-admin-dashboard</strong>
</a>

</p>

<p align="center">
  <strong>
    A modern, responsive product management dashboard built with Next.js,
    React, TypeScript, Tailwind CSS and Axios.
  </strong>
</p>

<img width="1917" height="870" alt="Screenshot 2026-09-26 135553" src="https://github.com/user-attachments/assets/064b40db-a699-4295-a491-056fe5c3cac5" />
---
<img width="1900" height="872" alt="Screenshot 2026-09-26 135642" src="https://github.com/user-attachments/assets/fd3532e1-db34-4b91-8ab8-8fa1ef9c5b8a" />
---
<img width="1897" height="872" alt="Screenshot 2026-09-26 135729" src="https://github.com/user-attachments/assets/71ee0a61-a060-43b0-b8f6-1fe56145fa5a" />
---

## 📋 Overview

Product Admin Dashboard is a frontend application for managing products through a clean and responsive admin interface.

The application includes:

- Secure login authentication
- Product listing
- Search
- Category filtering
- Sorting
- Pagination
- Product details
- Add product
- Edit product
- Delete product
- Responsive design
- Loading and error states
- URL-based state management

## ✨ Features

### 🔐 Authentication

- Login using DummyJSON authentication API
- Protected dashboard routes
- Token stored in localStorage
- Logout functionality
- Login validation and error handling

### 📦 Product Management

- View products
- View product details
- Add products
- Edit products
- Delete products
- Product image support
- Product rating and stock information

### 🔎 Search & Filtering

- Search products by title
- Category filtering
- Price sorting
- Rating sorting
- Title sorting
- Search and category filtering are mutually exclusive

### 📄 Pagination

- Previous and Next buttons
- Page numbers
- Page size selection
- Supports 10, 20 and 50 products per page
- Displays current product range

### 📱 Responsive Design

- Desktop table layout
- Mobile card layout
- Responsive navigation and controls
- Mobile-friendly forms

### ⚡ Performance & UX

- Debounced search
- Request cancellation
- Loading states
- Empty states
- Error handling
- Retry functionality
- Disabled buttons during API operations

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | API requests |
| DummyJSON | Backend/API |
| Git & GitHub | Version control |
| Vercel | Deployment |

## 🌐 API

This project uses the DummyJSON API for authentication and product data.

API Base URL:

https://dummyjson.com

### Authentication

POST:

/auth/login

### Products

GET:

/products

### Product Search

GET:

/products/search?q={query}

### Categories

GET:

/products/categories

### Product Details

GET:

/products/{id}

### Add Product

POST:

/products/add

### Update Product

PUT:

/products/{id}

### Delete Product

DELETE:

/products/{id}

## 🔑 Demo Credentials

Use the following credentials to log in:

**Username**

emilys

**Password**

emilyspass

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/Pranavv78/product-admin-dashboard.git

### 2. Navigate to the Project

cd product-admin-dashboard

### 3. Install Dependencies

npm install

### 4. Start the Development Server

npm run dev

### 5. Open the Application

http://localhost:3000

## 📁 Project Structure

```text
product-admin-dashboard/
│
├── app/
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── products/
│   │   ├── add/
│   │   │   └── page.tsx
│   │   │
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   │
│   ├── page.tsx
│   └── layout.tsx
│
├── components/
│   └── ProductCard.tsx
│
├── lib/
│   └── axios.ts
│
├── services/
│   └── productService.ts
│
├── public/
│
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

---

## Step 10 — Authentication Flow

```md
## 🔐 Authentication Flow
```
1. User opens the application.
2. User is redirected to the login page if no token exists.
3. User enters the demo credentials.
4. Credentials are sent to the DummyJSON authentication API.
5. The returned token is stored in localStorage.
6. The user is redirected to the dashboard.
7. Axios automatically attaches the token to API requests.
8. Logout removes the stored token and redirects to login.

## 📦 Product Management Flow

### View Products

Products are loaded from the DummyJSON API with pagination.

### Search

Users can search products by title. Search requests are debounced to avoid unnecessary API calls.

### Filter

Products can be filtered by category.

### Sort

Products can be sorted by:

- Title
- Price
- Rating

### Add Product

Users can create a new product using the Add Product form.

### Edit Product

Users can update product information from the Edit Product page.

### Delete Product

Users can delete products after confirming the delete action.

## ⚙️ Implementation Details

### Axios

A shared Axios instance is used for API communication.

The Axios interceptor automatically adds the authentication token to requests.

### Debounced Search

Search input uses debounce functionality to reduce unnecessary API requests.

### Request Cancellation

AbortController is used to cancel outdated requests and prevent older search results from replacing newer results.

### URL State

The following dashboard state is reflected in the URL:

- Page
- Search
- Category
- Sort
- Limit

This allows dashboard state to be preserved when refreshing or sharing the URL.

## ⚠️ API Data Persistence

DummyJSON simulates product creation, update and deletion.

Because these operations are not permanently persisted by the API, the application maintains local state using localStorage so that newly added, edited and deleted products are reflected in the dashboard during the current browser session.

## 🛡️ Error Handling

The application handles:

- Invalid login credentials
- API errors
- Product not found
- Empty search results
- Invalid URL parameters
- Failed product operations
- Loading states
- Request cancellation

Users are provided with appropriate messages and Retry actions where applicable.

## 📱 Responsive Design

The dashboard is designed for both desktop and mobile devices.

### Desktop

Products are displayed in a structured table with product information and actions.

### Mobile

Products are displayed as responsive cards for better usability on smaller screens.

## 🌐 Live Demo

[Product Admin Dashboard](https://product-admin-dashboard-plum-eight.vercel.app/)

## 💻 GitHub Repository

[View Source Code](https://github.com/Pranavv78/product-admin-dashboard)

## 👨‍💻 Developer

### PRANAV CHAVAN

MCA Student

Suryadatta Institute of Management & Information Research (SIMMC)

Frontend / React / Next.js Developer

## 📄 License

This project was developed as a frontend assignment/project for demonstrating modern web development skills using Next.js, React, TypeScript, Tailwind CSS and Axios.

---

⭐ If you find this project useful, consider giving the repository a star.
