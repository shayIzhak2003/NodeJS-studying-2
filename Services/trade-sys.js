const express = require('express');
const { getAllEntities, createEntity, updateEntity, deleteEntity } = require('./dao');
const router = express.Router();
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { v4: uuidv4 } = require('uuid');
const { userSchema } = require('./webServices');


// entities:
const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  shortable: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// const traderSchema = new mongoose.Schema({
//   position: [{
//     stock: mongoose.Schema.Types.ObjectId,
//     amount: Number
//   }],
//   balance: {
//     required: true,
//     type: Number,
//     min: 50000
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true
//   },
// }, { timestamps: true });


const STOCK_ENTITY = "stocks";

const TRADER_ENTITY = "users";

/**
 * @swagger
 * /trade-api/stocks:
 *   get:
 *     summary: Get all stocks
 *     responses:
 *       200:
 *         description: List of all stocks
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
 * /trade-api/stocks/{id}:
 *   get:
 *     summary: Get stock by ID
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
 * /trade-api/stocks:
 *   post:
 *     summary: Create new stock
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
 *               shortable:
 *                 type: boolean
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
 * /trade-api/stocks/{id}:
 *   put:
 *     summary: Update stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Stock updated
 */
router.put('/stocks/:id', async (req, res) => {
  try {
    const updated = await updateEntity({ _id: req.params.id, ...req.body }, STOCK_ENTITY, stockSchema);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update stock", error: err });
  }
});

/**
 * @swagger
 * /trade-api/stocks/{id}:
 *   delete:
 *     summary: Delete stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock deleted
 */
router.delete('/stocks/:id', async (req, res) => {
  try {
    await deleteEntity(req.params.id, STOCK_ENTITY, stockSchema);
    res.status(200).json({ message: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete stock", error: err });
  }
});

/**
 * @swagger
 * /trade-api/traders/{traderId}/buy/{stockId}:
 *   post:
 *     summary: Trader buys stock
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
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Trader bought stock
 */
router.post('/traders/:traderId/buy/:stockId', async (req, res) => {
  const { traderId, stockId } = req.params;
  const { amount } = req.body;

  try {
    const traders = await getAllEntities(TRADER_ENTITY, userSchema);
    const stocks = await getAllEntities(STOCK_ENTITY, stockSchema);
    const users = await getAllEntities("users", userSchema); // assuming "users" is ENTITY_NAME

    const trader = traders.find(t => t._id.toString() === traderId);
    const stock = stocks.find(s => s._id.toString() === stockId);
    const user = users.find(u => u.name === trader.name); // link via name

    if (!trader || !stock || !user) {
      return res.status(404).json({ message: 'Trader, stock, or user not found' });
    }

    const totalCost = stock.price * amount;
    if (trader.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 1. Update trader
    const existingPosition = trader.position.find(p => p.stock.toString() === stockId);
    if (existingPosition) {
      existingPosition.amount += amount;
    } else {
      trader.position.push({ stock: stock._id, amount });
    }
    trader.balance -= totalCost;
    const updatedTrader = await updateEntity(trader, TRADER_ENTITY, traderSchema);

    // 2. Update user.stocks
    const userStock = user.stocks.find(s => s.symbol === stock.symbol);
    if (userStock) {
      userStock.worth += totalCost;
    } else {
      user.stocks.push({ symbol: stock.symbol, worth: totalCost });
    }

    // 3. Recalculate totalWorthOfStocks
    user.totalWorthOfStocks = user.stocks.reduce((sum, s) => sum + (s.worth || 0), 0);

    // 4. Persist user update
    const updatedUser = await updateEntity(
      {
        ...user,
        _id: user._id,
      },
      "users", // ENTITY_NAME
      userSchema
    );

    res.status(200).json({ trader: updatedTrader, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to buy stock', error: err.message });
  }
});


module.exports = router;