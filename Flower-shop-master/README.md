# 🌸 Happy Petals - Premium Flower Shop Website

A modern, responsive e-commerce floral boutique web application built with clean HTML5, CSS3, and vanilla JavaScript.

---

## 📁 Project Structure

```
Flower-shop-master/
├── index.html            # Main storefront & landing page
├── checkout.html         # Cart, customer details, live ETA calculation & invoice generator
├── contact.html          # Contact & custom order inquiry form
├── delivery.html         # Delivery zones, policies, and schedules
├── login.html            # Customer sign-in & session management
├── registration.html     # Member registration
├── special.html          # Seasonal catalog & curated gift arrangements
├── testimonials.html     # Customer reviews & review submission form
├── css/
│   └── flowershop.css    # Unified responsive styles & theme variables
├── js/
│   └── shop.js           # E-commerce cart engine, toast alerts, auth & search
├── images/               # Product photography & floral assets
├── LICENSE               # License file
├── package.json          # Project metadata and quick start scripts
├── requirements.txt      # Python dependencies (Flask, Gunicorn)
├── app.py                # Python web server
└── README.md             # Project documentation
```

---

## ✨ Features

- **🛒 Interactive Shopping Basket**: Add to cart, adjust quantities, calculate real-time totals in INR (₹), and persistent storage via `localStorage`.
- **🧾 Instant Invoice & PDF Generation**: Generates itemized order receipts with order IDs and downloadable PDF format (`html2pdf.js`).
- **👤 User Authentication**: Client-side member registration and sign-in with personalized header greetings.
- **📬 Contact & Special Orders**: Form validation and inquiry storage with instant visual confirmation.
- **🚚 Delivery & ETA Estimator**: Real-time dispatch calculation based on delivery date & time slot selection.
- **🔍 Catalog Search & Filtering**: Live search across featured floral collections and seasonal specials.
- **📱 Fully Responsive**: Fluid design optimized across desktop, tablet, and mobile displays.

---

## 🚀 How to Run

### Method 1: Direct in Browser
Simply open [`index.html`](index.html) in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox).

### Method 2: Python Web Server
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```
*Or standard Python built-in server:*
```bash
python -m http.server 8000
```
Then visit `http://localhost:5000` (or `http://localhost:8000`).

### Method 3: Local Static Server (Node.js)
```bash
npm start
```
Then visit `http://localhost:3000` in your browser.

---

## 💾 Server Backup
The previous Node.js/Express backend has been safely backed up to your Desktop at:
`Desktop/flower_shop_server_backup`

The frontend website is fully standalone and operates 100% independently without requiring a backend server.
