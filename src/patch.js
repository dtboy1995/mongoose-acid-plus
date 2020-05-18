const { parse } = require('@babel/parser')
const { default: generate } = require('@babel/generator')
const { default: traverse } = require('@babel/traverse')
const t = require('@babel/types')

const PATCHS = [
    'findById',
    'findByIdAndUpdate',
    'findByIdAndRemove',
    'findByIdAndDelete',
    'findOne',
    'findOneAndUpdate',
    'findOneAndRemove',
    'findOneAndDelete',
    'deleteOne',
    'deleteMany',
    'updateOne',
    'updateMany',
    'update',
    'insertMany'
].join('|')

function patch(tx_fn) {
    const ast = parse(tx_fn.toString())
    traverse(ast, {
        ArrowFunctionExpression(path) {
            if (path.parentPath.parentPath.isProgram()) {
                path.node.params.push(
                    t.identifier('session')
                )
            }
        },
        CallExpression(path) {
            if (path.parentPath.isAwaitExpression()) {
                let { code } = generate(path.node)
                // patch返回[Query]的方法
                if (new RegExp(`^\\w+.(${PATCHS})\\(`).test(code)) {
                    path.replaceWithSourceString(`${code}.setOption({ session })`)
                    path.stop()
                }
                // patch[create]方法
                if (/^\w+.create\(/.test(code)) {
                    if (!t.isArrayExpression(path.node.arguments[0])) {
                        path.node.arguments[0] = t.arrayExpression([path.node.arguments[0]])
                    }
                    path.node.arguments.push(
                        t.objectExpression(
                            [t.objectProperty(t.identifier('session'), t.identifier('session'))]
                        )
                    )

                }
            }
        },
    })
    let { code } = generate(ast, {})
    return code
}

module.exports = patch