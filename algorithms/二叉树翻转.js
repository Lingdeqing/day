var tree = {
    id: 1,
    left: {
        id: 2
    },
    right: {
        id: 3,
        left: {
            id: 4
        }
    }
}
var tree2 = {
    id: 1,
    left: {
        id: 2,
        right: {
            id: 4
        }
    },
    right: {
        id: 3
    }
}

// 层次遍历打印
function printBinaryTree(root) {
    if (root) {
        var queue = [root], node
        var print = []
        while (node = queue.shift()) {
            print.push(node.id)
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)
        }
        console.log(print.join(','))
    }
}

// 左右翻转
function invertBinaryTree(root) {
    if (root) {
        if (root.left) {
            if (root.right) {
                var temp = root.right
                root.right = root.left
                root.left = temp
            } else {
                root.right = root.left
                delete root.left
            }
            invertBinaryTree(root.left)
            invertBinaryTree(root.right)
        }
    }
}

// 上下翻转
function invertBinaryTree2(root) {
    if (root) {
        if (!root.left && !root.right) {
            return root
        }

        var left = invertBinaryTree2(root.left)
        if (left) {
            left.right = root
        }

        var right = invertBinaryTree2(root.left)
        if (right) {
            right.left = root
        }

        root.left = root.right = null
        return root
    }
}

printBinaryTree(tree)
invertBinaryTree(tree)
printBinaryTree(tree)

invertBinaryTree2(tree2)
