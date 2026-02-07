# Currency Exchange Frontend

A React application that displays real-time currency exchange rates in a beautiful mosaic layout.

## Features

- ✅ **Real-time Exchange Rates** - Fetches latest rates from backend API
- ✅ **Beautiful Mosaic Layout** - Responsive grid display with gradient cards
- ✅ **Auto-refresh** - Updates every 5 minutes automatically
- ✅ **Manual Refresh** - Refresh button to get latest data
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Visual Timestamps** - Shows when data was last updated
- ✅ **Error Handling** - Graceful error states and loading indicators

## Tech Stack

- **React 18** - Modern React with hooks
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with gradients and animations
- **React Scripts** - Development and build tooling

## Project Structure

```
frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── Header.js        # App header with refresh
│   │   ├── Header.css
│   │   ├── CurrencyCard.js  # Individual currency card
│   │   ├── CurrencyCard.css
│   │   ├── CurrencyGrid.js  # Grid layout container
│   │   └── CurrencyGrid.css
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── App.js               # Main application component
│   ├── App.css
│   ├── index.js             # React entry point
│   └── index.css
├── package.json
├── .env.example             # Environment template
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- Backend API running (default: http://localhost:3000)

## Installation

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if your backend API is not on the default URL:

```env
BACKEND_API_URL=http://localhost:3000/api
```

### 4. Start Development Server

```bash
npm start
```

The app will open at http://localhost:3000 (or another port if 3000 is taken).

## Available Scripts

### `npm start`

Runs the app in development mode.  
Open http://localhost:3000 to view it in the browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in interactive watch mode.

## Features in Detail

### Currency Cards

Each currency is displayed in a colorful gradient card showing:
- **Currency Symbol** - Large visual identifier (e.g., $, €, ¥)
- **Currency Code** - Three-letter code (USD, EUR, etc.)
- **Exchange Rate** - Rate against MXN (Mexican Peso)
- **Currency Name** - Full name of the currency
- **Last Updated** - When the rate was last modified
- **Rate Date** - The date of the exchange rate data

### Auto-refresh

- Fetches latest rates on mount
- Auto-refreshes every 5 minutes
- Manual refresh button available
- Shows loading state during refresh

### Responsive Design

The grid layout adapts to screen size:
- **Desktop** (>1200px): 4-5 columns
- **Tablet** (768-1200px): 2-3 columns
- **Mobile** (<768px): 1-2 columns

### Color Scheme

Cards use beautiful gradient backgrounds that cycle through different color schemes:
- Purple to Violet
- Pink to Red
- Blue to Cyan
- Green to Turquoise
- Pink to Yellow

## API Integration

The app connects to your backend API at the configured URL:

### Endpoints Used

- `GET /api/rates/latest` - Fetches latest exchange rates

### Expected Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "series_id": "SF343410",
      "currency_code": "USD",
      "currency_name": "US Dollar",
      "exchange_rate": "17.125000",
      "date": "2024-02-04",
      "created_at": "2024-02-04T10:00:00Z",
      "updated_at": "2024-02-04T10:00:00Z"
    }
  ],
  "count": 5
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_API_URL` | Backend API base URL | http://localhost:3000/api |

## Building for Production

### 1. Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### 2. Serve Production Build

You can serve the production build with any static file server:

```bash
# Using serve
npx serve -s build

# Using http-server
npx http-server build

# Using nginx (see deployment section)
```

## Docker Support

### Build Docker Image

```bash
docker build -t currency-exchange-frontend .
```

### Run Container

```bash
docker run -d \
  --name currency-frontend \
  -p 80:80 \
  currency-exchange-frontend
```

## Deployment

### Deploy to Nginx

1. Build the production app:
   ```bash
   npm run build
   ```

2. Copy `build/` contents to nginx html directory:
   ```bash
   sudo cp -r build/* /usr/share/nginx/html/
   ```

3. Configure nginx to serve the app and proxy API requests.

### Deploy to AWS S3 + CloudFront

1. Build the app:
   ```bash
   npm run build
   ```

2. Upload to S3:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

3. Configure CloudFront distribution to serve from S3.

### Environment-Specific Builds

Create environment-specific `.env` files:

- `.env.development` - Development settings
- `.env.production` - Production settings

React will automatically use the correct file based on `NODE_ENV`.

## Customization

### Changing Colors

Edit gradient colors in `src/components/CurrencyCard.css`:

```css
.currency-card:nth-child(5n+1) {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Changing Refresh Interval

Edit `src/App.js` to change auto-refresh interval:

```javascript
// Change from 5 minutes to desired time
const interval = setInterval(fetchRates, 5 * 60 * 1000);
```

### Adding More Currency Symbols

Edit `getCurrencySymbol` function in `src/components/CurrencyCard.js`:

```javascript
const symbols = {
  USD: '$',
  EUR: '€',
  // Add more here
};
```

## Troubleshooting

### CORS Errors

If you see CORS errors in the console:

1. Ensure backend CORS is configured to allow frontend origin
2. Check `package.json` has correct proxy setting
3. Verify backend is running on expected port

### Data Not Loading

1. Check backend API is running: `curl http://localhost:3000/api/health`
2. Verify API URL in `.env` is correct
3. Check browser console for error messages
4. Ensure database has exchange rate data

### Build Fails

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear npm cache: `npm cache clean --force`
4. Try `npm run build` again

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images (if added)
- Optimized bundle size
- CSS animations use GPU acceleration
- Efficient React rendering with hooks

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

## Future Enhancements

Potential features to add:
- [ ] Currency comparison tool
- [ ] Historical rate charts
- [ ] Rate change indicators (up/down arrows)
- [ ] Favorite currencies
- [ ] Search/filter functionality
- [ ] Dark mode toggle
- [ ] Export rates to CSV
- [ ] Push notifications for rate changes

## License

MIT

## Support

For issues or questions, check the logs and API documentation.
