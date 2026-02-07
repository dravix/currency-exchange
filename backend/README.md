# Currency Exchange Backend API

A Node.js/Express.js REST API that connects to the Banxico (Banco de México) API to fetch currency exchange rates and stores them in a MySQL database.

## Features

- ✅ RESTful API endpoints for currency exchange data
- ✅ Integration with Banxico first-party API
- ✅ MySQL database for persistent storage
- ✅ Automatic data synchronization
- ✅ Historical exchange rate queries
- ✅ Health monitoring endpoints
- ✅ Comprehensive error handling
- ✅ CORS and security middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Axios** - HTTP client for API calls
- **mysql2** - MySQL driver with Promise support

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Configuration management
│   │   └── database.js        # Database connection pool
│   ├── controllers/
│   │   ├── currencyController.js
│   │   ├── exchangeRateController.js
│   │   └── healthController.js
│   ├── models/
│   │   ├── Currency.js
│   │   ├── ExchangeRate.js
│   │   └── SyncLog.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── currencies.js
│   │   ├── exchangeRates.js
│   │   └── health.js
│   ├── services/
│   │   ├── banxicoService.js  # Banxico API integration
│   │   └── syncService.js     # Data synchronization
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- MySQL 8.0+
- Banxico API token ([Get it here](https://www.banxico.org.mx/SieAPIRest/service/v1/))

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - Database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
   - Banxico API token (BANXICO_API_TOKEN)
   - Server port (PORT)

4. **Set up MySQL database**:
   ```bash
   mysql -u root -p < ../database/schema.sql
   ```
   
   Or manually create the database and run the schema file.

## Configuration

Edit `.env` file with your settings:

```env
NODE_ENV=development
PORT=3000

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=currency_exchange

# Banxico API
BANXICO_API_URL=https://www.banxico.org.mx/SieAPIRest/service/v1/series
BANXICO_API_TOKEN=your_api_token_here
```

## Running the Server

**Development mode (with auto-reload)**:
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health & Status

- **GET** `/api/health` - Health check (database + Banxico API status)
- **GET** `/api/health/sync-history` - Get synchronization history

### Currencies

- **GET** `/api/currencies` - Get all active currencies
- **GET** `/api/currencies/:currencyCode` - Get specific currency by code
- **POST** `/api/currencies` - Create or update currency

### Exchange Rates

- **GET** `/api/rates` - Get all exchange rates (with optional filters)
  - Query params: `currencyCode`, `startDate`, `endDate`, `limit`
- **GET** `/api/rates/latest` - Get latest rates for all currencies
- **GET** `/api/rates/:currencyCode` - Get historical data for specific currency
- **POST** `/api/rates/sync` - Trigger manual sync from Banxico API
  - Body: `{ "startDate": "2024-01-01", "endDate": "2024-12-31" }`

## Example API Calls

### Get latest exchange rates
```bash
curl http://localhost:3000/api/rates/latest
```

### Get USD historical data
```bash
curl http://localhost:3000/api/rates/USD?startDate=2024-01-01&endDate=2024-12-31
```

### Trigger manual sync
```bash
curl -X POST http://localhost:3000/api/rates/sync \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2024-01-01", "endDate": "2024-12-31"}'
```

### Health check
```bash
curl http://localhost:3000/api/health
```

## Database Schema

The application uses three main tables:

- **currencies** - Stores currency metadata (code, name, Banxico series ID)
- **exchange_rates** - Stores historical exchange rate data
- **sync_logs** - Tracks API synchronization history

See [database/schema.sql](../database/schema.sql) for full schema.

## Banxico API Integration

The application integrates with Banxico's official API to fetch exchange rates. Key features:

- Fetches data for multiple currency series
- Supports date range queries
- Handles API errors gracefully
- Automatic retry logic
- Token-based authentication

### Supported Currencies

Default currencies (can be extended):
- USD - US Dollar (SF43718)
- EUR - Euro (SF46410)
- GBP - British Pound (SF46407)
- JPY - Japanese Yen (SF46406)
- CAD - Canadian Dollar (SF43728)

## Error Handling

The API provides comprehensive error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

HTTP status codes:
- `200` - Success
- `400` - Bad request
- `404` - Resource not found
- `500` - Internal server error
- `503` - Service unavailable

## Development

### Adding a New Currency

1. Add currency to the database:
```bash
curl -X POST http://localhost:3000/api/currencies \
  -H "Content-Type: application/json" \
  -d '{
    "currency_code": "CHF",
    "currency_name": "Swiss Franc",
    "series_id": "SF46405"
  }'
```

2. The currency will be included in the next sync operation.

### Running Tests

```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name currency-exchange-api
   ```
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure database connection pooling
6. Enable monitoring and logging

## Security Considerations

- Environment variables for sensitive data
- Helmet.js for security headers
- CORS configuration
- Input validation
- SQL injection prevention (parameterized queries)
- Rate limiting (recommended for production)

## Monitoring

- Health check endpoint: `/api/health`
- Sync history: `/api/health/sync-history`
- Database connection status
- External API availability

## License

MIT

## Support

For issues or questions, please contact the development team.
