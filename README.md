# Cocktail Business Project

A modern Next.js e-commerce application for a cocktail business, featuring dynamic product pages, shopping cart functionality, and Stripe payment integration.

## 🚀 Tech Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Styled-components** - CSS-in-JS styling solution
- **Prisma** - Database ORM with PostgreSQL
- **Stripe** - Payment processing

### Development Tools

- **ESLint** - Code linting
- **Jest** - Testing framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Database & Infrastructure

- **PostgreSQL** - Production database
- **SQLite** - Development database
- **Prisma Accelerate** - Database connection pooling and caching
- **Vercel** - Deployment platform

### Fonts & Icons

- **Geist Font** - Optimized font family by Vercel
- **next/font** - Font optimization

## 📁 Project Structure

```text
├── src/
│   ├── app/                    # App Router directory
│   │   ├── api/               # API routes
│   │   ├── cart/              # Shopping cart pages
│   │   ├── checkout/          # Checkout flow
│   │   ├── shop/              # Product pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page component
│   ├── components/            # Reusable components
│   │   ├── CartIcon/          # Shopping cart icon
│   │   ├── Navigation/        # Navigation components
│   │   ├── ProductPage/       # Product display components
│   │   └── ...                # Other components
│   ├── contexts/              # React contexts
│   ├── data/                  # Data fetching services
│   ├── lib/                   # Utility libraries
│   ├── theme/                 # Styled-components theme
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── prisma/                    # Database configuration
│   ├── migrations/            # Database migrations
│   ├── schema.prisma          # Database schema
│   ├── schema.dev.prisma      # Development schema
│   ├── schema.prod.prisma     # Production schema
│   └── seed.ts                # Database seeding
├── public/                    # Static assets
├── __tests__/                 # Test files
└── ...                        # Configuration files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager
- PostgreSQL database (for production)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cocktail-business-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` for development:

   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_public_key"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   ```

4. **Set up the database**

   ```bash
   # For development (SQLite)
   npm run db:dev
   npm run db:seed

   # For production (PostgreSQL)
   npm run db:prod
   npx prisma migrate deploy
   npm run db:seed:prod
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with production database
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ci` - Run tests in CI mode (with coverage, no watch)
- `npm run db:dev` - Switch to development database (SQLite)
- `npm run db:prod` - Switch to production database (PostgreSQL)
- `npm run db:seed` - Seed development database
- `npm run db:seed:prod` - Seed production database

## 🎨 Styling & Theming

This project uses **Styled-components** for styling with a comprehensive theme system:

### Theme Structure

- **Colors**: Primary, secondary, accent colors with light/dark variants
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Breakpoints**: Responsive design breakpoints
- **Shadows**: Elevation and depth system

### Component Styling

- Each component has its own `.styles.tsx` file
- Styled-components provide CSS-in-JS with TypeScript support
- Theme-aware components that adapt to light/dark modes
- Responsive design with mobile-first approach

## 🗄️ Database Schema

### Product Model

```prisma
model Product {
  id              String   @id @default(cuid())
  name            String
  subtitle        String
  description     String
  longDescription String
  price           String
  priceSubtext    String
  imageColor      String
  imageUrl        String?
  features        Json
  ingredients     Json?    // Array of ingredient strings
  productBrief    String?  // Product introduction
  nutritionFacts  Json?    // Array of nutrition facts
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("products")
}
```

### Key Features

- **Ingredients**: JSON array of ingredient lists
- **Product Brief**: Detailed product descriptions
- **Nutrition Facts**: Nutritional information tables
- **Image Management**: Color placeholders with optional image URLs
- **Features**: Product feature badges and highlights

## 🚀 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Import your project to Vercel**
3. **Configure environment variables**:
   - `DATABASE_URL` - Prisma Accelerate connection
   - `DIRECT_URL` - Direct PostgreSQL connection
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
   - `STRIPE_SECRET_KEY` - Stripe secret key
4. **Deploy automatically on every push**

### Production Database Setup

```bash
# Deploy to production
vercel --prod

# Seed production database
npm run db:seed:prod
```

### CI/CD with GitHub Actions

This project includes automated CI/CD pipelines using GitHub Actions:

- **Quality Checks**: Automatically runs on every push and pull request
  - TypeScript type checking
  - ESLint code linting
  - Jest test suite execution
  - Build validation

- **Automated Deployment**: Deploys to Vercel only after all checks pass
  - Runs on pushes to `main` or `master` branches
  - Ensures only tested, validated code reaches production

**Setup Instructions**: See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md#step-5-github-actions-cicd-setup) for detailed setup guide.

**Required GitHub Secrets**:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## 🧪 Testing

The project includes comprehensive testing with Jest:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API route and data service tests
- **Test Utilities**: Custom test helpers and mocks

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📊 API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get specific product
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/checkout-session` - Handle checkout completion
- `POST /api/seed-production` - Seed production database

## 🎯 Key Features

### Product Pages

- **Dynamic Loading**: Skeleton loading states for better UX
- **Rich Information**: Ingredients, nutrition facts, and product briefs
- **Image Management**: Color placeholders with fallback images
- **Responsive Design**: Mobile-first approach

### Shopping Experience

- **Cart Management**: Add/remove items with quantity controls
- **Checkout Flow**: Seamless Stripe integration
- **Order Confirmation**: Success pages with order details

### Performance

- **Database Optimization**: Prisma Accelerate for connection pooling
- **Image Optimization**: Next.js Image component with optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Intelligent caching strategies

## 🔧 Configuration Files

### `next.config.ts`

- Image optimization settings
- Environment variable configuration
- Custom webpack configuration

### `prisma/schema.prisma`

- Database schema definition
- Prisma client configuration
- Migration settings

### `tsconfig.json`

- TypeScript compiler options
- Path mapping configuration
- Strict type checking

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Styled-components Documentation](https://styled-components.com/docs) - Learn Styled-components
- [Prisma Documentation](https://www.prisma.io/docs) - Learn Prisma ORM
- [Stripe Documentation](https://stripe.com/docs) - Learn Stripe integration
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - Learn TypeScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- Check the [Next.js GitHub repository](https://github.com/vercel/next.js)
- Open an issue in this repository
- Consult the documentation links above

---

**Happy coding! 🎉**
