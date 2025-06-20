# Deployment Notes

## NPI Lookup Service

### Current Implementation

The NPI lookup functionality currently uses demo/mock data for the following reasons:

1. **CORS Limitations**: The CMS NPI Registry API (`https://npiregistry.cms.hhs.gov/api`) does not allow direct browser requests due to Cross-Origin Resource Sharing (CORS) restrictions.

2. **Frontend-Only Demo**: This is a frontend-only demo application without a backend server to proxy API requests.

### Demo NPI Numbers

The following NPI numbers are available for testing:

- `1234567890` - Dr. John Smith (Family Medicine)
- `1578714549` - Sarah Johnson (Nurse Practitioner)
- `1234567893` - City General Hospital
- `1111111116` - Dr. Maria Garcia (Dentist)

### Production Implementation

In a production environment, you would need to:

1. **Backend API**: Create a backend service (Node.js, Python, etc.) to handle NPI lookups
2. **Proxy Requests**: Your backend would call the CMS NPI Registry API and return results to the frontend
3. **API Endpoint**: Create an endpoint like `/api/npi/lookup` that your frontend calls
4. **Error Handling**: Implement proper error handling for API failures, rate limits, etc.

### Example Backend Implementation (Node.js/Express)

```javascript
app.get("/api/npi/lookup/:npiNumber", async (req, res) => {
  try {
    const { npiNumber } = req.params;
    const response = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?number=${npiNumber}&version=2.1`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "NPI lookup failed" });
  }
});
```

## Other API Considerations

- The app uses mock data for educational purposes
- All profile data is stored locally in browser storage
- No actual user accounts or data persistence occurs
- In production, you'd integrate with a real user management system and database
