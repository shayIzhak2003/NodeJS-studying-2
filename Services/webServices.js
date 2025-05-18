// trading.js (your route file)
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const {
  getAllEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} = require('./dao');

// Schemas
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  shortable: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true, unique: true },
  stocks: [{
    symbol: String,
    worth: Number
  }],
  totalWorthOfStocks: { type: Number, default: 0 },
  total: Number,
  balance: { type: Number, min: 50000 },
  position: [{
    stock: mongoose.Schema.Types.ObjectId,
    amount: Number
  }]
}, { strict: false });

const STOCK_ENTITY = "stocks";
const USER_ENTITY = "users";

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Trading API');
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/users', async (req, res) => {
  try {
    const users = await getAllEntities(USER_ENTITY, userSchema);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/users', async (req, res) => {
  const id = uuidv4();
  const { name, total = 0, stocks = [], balance = 50000 } = req.body;

  try {
    const newUser = await createEntity({ id, name, total, stocks, totalWorthOfStocks: 0, balance }, USER_ENTITY, userSchema);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
});

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Get all stocks
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: A list of stocks
 */
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await getAllEntities(STOCK_ENTITY, stockSchema);
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stocks", error: err });
  }
});

/**
 * @swagger
 * /api/stocks/{id}:
 *   get:
 *     summary: Get a stock by ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock data
 *       404:
 *         description: Stock not found
 */
router.get('/stocks/:id', async (req, res) => {
  try {
    const stock = await getEntity(req.params.id, STOCK_ENTITY, stockSchema);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.status(200).json(stock);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock", error: err });
  }
});

/**
 * @swagger
 * /api/stocks:
 *   post:
 *     summary: Create a new stock
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - price
 *             properties:
 *               symbol:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Stock created
 */
router.post('/stocks', async (req, res) => {
  try {
    const newStock = await createEntity(req.body, STOCK_ENTITY, stockSchema);
    res.status(201).json(newStock);
  } catch (err) {
    res.status(500).json({ message: "Failed to create stock", error: err });
  }
});

/**
 * @swagger
 * /api/traders/{traderId}/buy/{stockId}:
 *   post:
 *     summary: Trader buys stock
 *     tags: [Trade]
 *     parameters:
 *       - in: path
 *         name: traderId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stockId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Trade successful
 */
router.post('/traders/:traderId/buy/:stockId', async (req, res) => {
  const { traderId, stockId } = req.params;
  const { amount } = req.body;

  try {
    const users = await getAllEntities(USER_ENTITY, userSchema);
    const stocks = await getAllEntities(STOCK_ENTITY, stockSchema);

    const trader = users.find(t => t._id.toString() === traderId);
    const stock = stocks.find(s => s._id.toString() === stockId);

    if (!trader || !stock) {
      return res.status(404).json({ message: 'Trader or stock not found' });
    }

    const totalCost = stock.price * amount;
    if (trader.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const existingPosition = trader.position?.find(p => p.stock.toString() === stockId);
    if (existingPosition) {
      existingPosition.amount += amount;
    } else {
      trader.position = trader.position || [];
      trader.position.push({ stock: stock._id, amount });
    }

    trader.balance -= totalCost;

    const ownedStock = trader.stocks?.find(s => s.symbol === stock.symbol);
    if (ownedStock) {
      ownedStock.worth += totalCost;
    } else {
      trader.stocks = trader.stocks || [];
      trader.stocks.push({ symbol: stock.symbol, worth: totalCost });
    }

    trader.totalWorthOfStocks = trader.stocks.reduce((sum, s) => sum + (s.worth || 0), 0);

    const updatedTrader = await updateEntity({ ...trader, _id: trader._id }, USER_ENTITY, userSchema);
    res.status(200).json({ trader: updatedTrader });
  } catch (err) {
    res.status(500).json({ message: 'Failed to buy stock', error: err.message });
  }
});

module.exports = router;