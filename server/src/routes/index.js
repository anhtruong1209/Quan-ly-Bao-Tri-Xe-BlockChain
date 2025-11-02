const UserRouter = require('./UserRouter')
const VehicleRouter = require("./VehicleRouter")
const RecordRouter = require("./RecordRouter")
const MaintenanceRouter = require("./MaintenanceRouter")
// const ProductRouter = require('./ProductRouter')
// const OrderRouter = require('./OrderRouter')
// const PaymentRouter = require('./PaymentRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/vehicle', VehicleRouter)
    app.use('/api/records', RecordRouter)
    app.use('/api/maintenance', MaintenanceRouter)
    // app.use('/api/order', OrderRouter)
    // app.use('/api/payment', PaymentRouter)
}

module.exports = routes