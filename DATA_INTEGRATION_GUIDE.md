# Data Source Integration Documentation

## Overview

This system allows you to seamlessly switch between mock data and real API data from your Spring Boot backend. The mock data is preserved so you can always revert to static data if needed.

## Key Features

- **Dual Data Sources**: Switch between mock data and real API data
- **Granular Control**: Enable/disable real data for specific features
- **Fallback Mechanism**: Automatically falls back to mock data if API is unavailable
- **Mock Data Preservation**: All original mock files are kept intact
- **Easy Configuration**: Simple UI to manage data sources

## Architecture

### Core Components

1. **DataSourceService**: Manages configuration and determines which data source to use
2. **HttpService**: Handles all HTTP communication with the Spring Boot backend
3. **Enhanced Services**: Updated services that can use both mock and real data
4. **DataSourceControlComponent**: UI component for managing data sources

### Data Flow

```
Component → Service → DataSourceService → [Mock Data | API Call] → Response
```

## Configuration

### Using the Data Source Control Component

Add the data source control component to your admin panel:

```typescript
import { DataSourceControlComponent } from './core/components/data-source-control/data-source-control.component';

// In your admin component template:
<app-data-source-control></app-data-source-control>
```

### Manual Configuration

You can also configure data sources programmatically:

```typescript
import { DataSourceService } from './core/services/data-source.service';

constructor(private dataSourceService: DataSourceService) {}

// Enable real data globally
this.dataSourceService.setUseRealData(true);

// Enable specific features
this.dataSourceService.setFeature('services', true);
this.dataSourceService.setFeature('testimonials', true);

// Set API base URL
this.dataSourceService.setApiBaseUrl('http://localhost:8080/api/v1');
```

## Updated Services

### Services with Real Data Integration

All the following services now support both mock and real data:

1. **HomeService** - Services and general home page data
2. **TestimonialService** - Customer testimonials
3. **TeamService** - Team member information
4. **SettingsService** - Site settings and configuration
5. **BlogService** - Blog posts and articles
6. **EnquiryService** - Contact form submissions
7. **SiteSettingsService** - Global site settings

### Service Usage Examples

```typescript
// Services automatically use the configured data source
this.homeService.getServices().subscribe(services => {
  // Will use either mock data or real API data based on configuration
  console.log('Services:', services);
});

// Check if using real data
if (this.dataSourceService.shouldUseRealData('services')) {
  console.log('Using real API data for services');
} else {
  console.log('Using mock data for services');
}
```

## API Endpoints

### Base URLs

- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.altrevo.com/v1`

### Public Endpoints (No Authentication)

- `GET /public/services` - Get all services
- `GET /public/testimonials` - Get all testimonials
- `GET /public/team` - Get team members
- `GET /public/settings` - Get site settings
- `POST /public/enquiries` - Submit contact form

### Admin Endpoints (Authentication Required)

- `GET /admin/services` - Get all services (including drafts)
- `POST /admin/services` - Create new service
- `PUT /admin/services/{id}` - Update service
- `DELETE /admin/services/{id}` - Delete service
- Similar patterns for other resources

## Authentication

### For Admin Endpoints

The system automatically adds authentication headers for admin endpoints:

```typescript
// Authentication token is automatically added by HttpService
Authorization: Bearer <jwt-token>
```

### Token Management

Store the JWT token in localStorage:

```typescript
// After login
localStorage.setItem('authToken', response.token);

// The HttpService will automatically use this token
```

## Error Handling

### Automatic Fallback

If API calls fail, the system automatically falls back to mock data:

```typescript
return this.httpService.get<Service[]>(endpoint).pipe(
  map(response => response.data || []),
  catchError(error => {
    console.error('API error, falling back to mock data:', error);
    return this.getServicesFromMock();
  })
);
```

### Error Types

- **Network Errors**: Falls back to mock data
- **Authentication Errors**: Returns appropriate error messages
- **Server Errors**: Falls back to mock data with error logging

## Migration Guide

### From Mock to Real Data

1. **Start your Spring Boot backend**
2. **Open the Data Source Control Panel**
3. **Enable "Use Real Data"**
4. **Set your API base URL**
5. **Enable features one by one**
6. **Test each feature**

### Reverting to Mock Data

1. **Open the Data Source Control Panel**
2. **Click "Use Mock Data Only"**
3. **Or disable "Use Real Data" toggle**

## Development Workflow

### Testing with Mock Data

```bash
# Default configuration uses mock data
ng serve
```

### Testing with Real Data

1. Start your Spring Boot backend:
```bash
cd spring-boot-backend
mvn spring-boot:run
```

2. Enable real data in the UI or set environment variable:
```typescript
// In your environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  useRealData: true
};
```

## Best Practices

### 1. Gradual Migration

Enable real data for one feature at a time:

```typescript
// Start with less critical features
this.dataSourceService.setFeature('testimonials', true);
// Then move to more critical ones
this.dataSourceService.setFeature('services', true);
```

### 2. Environment Configuration

Use different configurations for different environments:

```typescript
// development.ts
export const environment = {
  apiUrl: 'http://localhost:8080/api/v1',
  useRealData: false // Start with mock data in development
};

// production.ts
export const environment = {
  apiUrl: 'https://api.altrevo.com/v1',
  useRealData: true // Always use real data in production
};
```

### 3. Error Monitoring

Monitor API calls and fallbacks:

```typescript
// Add logging to track API usage
this.httpService.get<Service[]>(endpoint).pipe(
  tap(response => console.log('API call successful:', response)),
  catchError(error => {
    console.error('API call failed, using fallback:', error);
    // Send to error tracking service
    return this.getMockData();
  })
);
```

## File Structure

```
src/
├── app/
│   ├── core/
│   │   ├── components/
│   │   │   └── data-source-control/
│   │   │       └── data-source-control.component.ts
│   │   ├── constants/
│   │   │   └── api-endpoints.ts
│   │   ├── interfaces/
│   │   │   ├── api-response.interface.ts
│   │   │   ├── content.interface.ts
│   │   │   └── site-settings.interface.ts
│   │   └── services/
│   │       ├── data-source.service.ts
│   │       ├── http.service.ts
│   │       ├── site-settings.service.ts
│   │       ├── blog.service.ts
│   │       └── enquiry.service.ts
│   └── modules/
│       ├── public/
│       │   └── home/
│       │       ├── services/
│       │       │   ├── home.service.ts
│       │       │   └── testimonial.service.ts
│       │       └── mock/ (preserved)
│       │           ├── mock-services.ts
│       │           └── testimonials-data.ts
│       └── admin/
│           └── [existing admin modules with updated services]
```

## Testing

### Unit Tests

Test both mock and real data scenarios:

```typescript
describe('HomeService', () => {
  beforeEach(() => {
    // Test with mock data
    dataSourceService.setUseRealData(false);
  });

  it('should return mock services', () => {
    // Test mock data functionality
  });

  it('should return real services when API is available', () => {
    // Test real API functionality
  });
});
```

### Integration Tests

Test the complete data flow:

```typescript
describe('Data Integration', () => {
  it('should fallback to mock data when API is unavailable', () => {
    // Test fallback mechanism
  });

  it('should use real data when API is available', () => {
    // Test real data integration
  });
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your Spring Boot backend has CORS configured
   - Add `@CrossOrigin` annotation to your controllers

2. **Authentication Issues**
   - Check that JWT tokens are properly stored
   - Verify token expiration and refresh logic

3. **API Endpoint Mismatches**
   - Verify endpoint URLs match your Spring Boot backend
   - Check HTTP methods (GET, POST, PUT, DELETE)

4. **Data Format Differences**
   - Ensure API responses match expected interfaces
   - Update TypeScript interfaces if needed

### Debug Mode

Enable debug logging:

```typescript
// In your service
console.log('Using real data:', this.dataSourceService.shouldUseRealData('services'));
console.log('API URL:', this.dataSourceService.getApiBaseUrl());
```

## Support

For issues or questions:

1. Check the console for error messages
2. Verify your Spring Boot backend is running
3. Test with mock data first
4. Gradually enable real data features
5. Check network requests in browser dev tools

This system provides a robust way to integrate real data while maintaining the flexibility to use mock data when needed.
