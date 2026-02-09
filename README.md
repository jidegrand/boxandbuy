# BoxandBuy - Modern E-Commerce Platform

A headless e-commerce storefront built with Next.js 16, TypeScript, and integrated with PrestaShop backend.

## Features

- **Product Catalog**: Real-time product listing from PrestaShop API
- **Shopping Cart**: Persistent cart with Zustand state management
- **Checkout Flow**: Complete checkout with shipping/billing forms
- **Order Management**: Order placement and confirmation
- **Responsive Design**: Amazon-style UI built with Tailwind CSS
- **Image Integration**: Product images from PrestaShop
- **TypeScript**: Full type safety throughout

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with localStorage persistence
- **Backend**: PrestaShop Web Services API (XML)
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

## Features Breakdown

### Product Management
- Product listing with images
- Product detail pages with ISR (5-minute revalidation)
- Star ratings and reviews
- Price display with discounts
- Stock status indicators

### Shopping Experience
- Add to cart functionality
- Cart quantity management
- Persistent cart across sessions
- Real-time cart count updates
- Order summary calculations

### Checkout
- Shipping information form
- Billing address capture (with "same as shipping" option)
- Form validation
- Order review
- Order confirmation page
- Unique order ID generation

### UI/UX
- Amazon-inspired design
- Responsive layout
- Professional header/footer
- Category cards
- Hero banner
- Smooth transitions

## Live Demo

**Production**: [https://boxandbuy.vercel.app](https://boxandbuy.vercel.app)

## Local Development

```bash
# Clone repository
git clone https://github.com/jidegrand/boxandbuy.git
cd boxandbuy

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# PRESTASHOP_URL=https://your-prestashop-url.com
# PRESTASHOP_API_KEY=your-api-key

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
boxandbuy-storefront/
├── app/                      # Next.js app directory
│   ├── cart/                 # Shopping cart page
│   ├── checkout/             # Checkout flow
│   │   ├── actions.ts        # Server actions
│   │   ├── page.tsx          # Checkout form
│   │   └── success/          # Order confirmation
│   ├── products/[id]/        # Product detail pages (ISR)
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── layout/               # Header, Footer, HeroBanner, etc.
│   └── products/             # ProductCard, ProductRow, ProductGrid
├── lib/                      # Business logic
│   ├── prestashop/           # API integration
│   │   ├── client.ts         # Axios client + XML parser
│   │   ├── products.ts       # Product fetching
│   │   └── orders.ts         # Order creation
│   └── store/                # State management
│       └── cart.ts           # Cart store (Zustand)
└── types/                    # TypeScript definitions
    ├── product.ts
    ├── cart.ts
    └── checkout.ts
```

## Configuration

### PrestaShop API Setup

1. Enable Web Services in PrestaShop
2. Create API key with permissions:
   - products (GET)
   - images (GET)
   - orders (GET, POST)
   - addresses (GET, POST)
   - customers (GET, POST)

### Environment Variables

Required variables in `.env.local`:

```
PRESTASHOP_URL=https://your-store.com
PRESTASHOP_API_KEY=your-api-key-here
```

## Deployment

Deployed automatically via Vercel:

1. Push to GitHub main branch
2. Vercel auto-deploys
3. Environment variables configured in Vercel dashboard

## Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] User authentication
- [ ] Order history page
- [ ] Product search functionality
- [ ] Category filtering
- [ ] Product reviews
- [ ] Wishlist
- [ ] Email notifications

## Developer

**Jide Grand**
- GitHub: [@jidegrand](https://github.com/jidegrand)
- Project: [BoxandBuy](https://github.com/jidegrand/boxandbuy)

## License

This project is open source and available under the MIT License.
