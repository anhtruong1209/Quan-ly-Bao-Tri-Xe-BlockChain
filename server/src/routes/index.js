const UserRouter = require('./UserRouter')
const RealEstateRouter = require("./RealEstateRouter")
const TransactionRouter = require("./TransactionRouter")
// const ProductRouter = require('./ProductRouter')
// const OrderRouter = require('./OrderRouter')
// const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/realestate', RealEstateRouter)
    app.use('/api/transaction', TransactionRouter)
    // app.use('/api/order', OrderRouter)
    // app.use('/api/payment', PaymentRouter)
}

module.exports = routes