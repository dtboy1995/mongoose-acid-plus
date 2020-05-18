const x = require('../src/acidplus')

let a = '草泥马'
let b = 'foo'
let c
let session = { tx: 'tx' }
x(
    async () => {
        console.log(a);
    }
).then((af) => {
    let a = 1
    return af(session)
})
    .then(console.log)
    .catch(console.log)
