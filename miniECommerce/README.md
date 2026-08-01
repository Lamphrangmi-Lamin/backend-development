## Mini E-commerce API

The mini e-commerce app provides an in-memory shopping experience with:

- Product browsing
- Cart management
- Order placement
- Order lookup by ID

> Note: all data is stored in memory, so it will reset when the server restarts.

## Project Structure

- miniECommerce/app.js — main Express server and API routes
- package.json — project dependencies and scripts

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   node miniECommerce/app.js
   ```

3. The server will run on:
   ```text
   http://localhost:8000
   ```

## API Endpoints

### Products

- GET /products — get all products
- GET /products/:id — get a single product by ID

### Cart

- GET /cart — get all cart items
- POST /cart — add a product to the cart
- PATCH /cart/:productId — update cart item quantity
- DELETE /cart/:productId — remove an item from the cart

### Orders

- POST /orders — place an order from the current cart
- GET /orders — get all placed orders
- GET /orders/:id — get a single order by ID

## Example Requests

### Add an item to cart

```bash
curl -X POST http://localhost:8000/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

### Update cart quantity

```bash
curl -X PATCH http://localhost:8000/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

### Place an order

```bash
curl -X POST http://localhost:8000/orders
```

## Sample Response Shape

### Product

```json
{
  "id": 1,
  "name": "Mechanical Keyboard",
  "price": 79.99,
  "stock": 10
}
```

### Order

```json
{
  "id": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "total": 159.98,
  "createdAt": "2026-07-31T10:00:00.000Z"
}
```

## Notes

- Product stock is checked before placing an order.
- The cart is cleared after a successful order placement.
- This app is intended for practice and demonstration purposes.
