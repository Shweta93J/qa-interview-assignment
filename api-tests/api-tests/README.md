# API Tests (Postman)

Collection: `Petstore.postman_collection.json`

## Run in Postman
1. Import the collection
2. Run requests in order:
   - POST Create Pet (positive)
   - GET Pet by Id (positive)
   - GET Pet by Id (negative - not found)
   - POST Create Pet (negative - invalid body)

`petId` is stored automatically in environment variables after the POST.

## Run via Newman (optional)
```bash
npm i -g newman
newman run Petstore.postman_collection.json
