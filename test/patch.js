const patch = require('../src/patch')

console.log(patch(async () => {
    await User.findById({ name: 'foo' }).select('foo').sort({ created_at: -1 })
    await User.findByIdAndUpdate('id', { foo: 'foo' })
    let user = await User.create({
        name: 'foo',
        phone: 'foo'
    })
}))