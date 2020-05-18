// const mongoose = require('mongoose')
// const patch = require('./patch')

// async function ACIDPlus(tx_fn) {
//     const session = await mongoose.startSession()
//     return session.withTransaction(() => {
//         return eval(patch(tx_fn))
//     })
// }

// module.exports = ACIDPlus

const mongoose = require('mongoose')
const patch = require('../src/patch')

function withTx(fn) {
    return fn()
}

async function ACIDPlus(tx_fn) {
    let session = { fuck: 'you' }
    return withTx(() => {
        let session = { fuck: 'you' }
        let fn = eval(`async function test(session) {
            console.log(a);
          };test(session)`)
        return fn
    })
}

module.exports = ACIDPlus