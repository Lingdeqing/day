function sort(array) {
    for (var i = 1, len = array.length; i < len; i++) {
        for (var j = i; j > 0 && array[j] < array[j - 1]; j--) {
            var temp = array[j]
            array[j] = array[j - 1]
            array[j-1] = temp
        }
    }
}

var array = [22, 14, 23, 15, 2, 23, 25, 17, 12]
sort(array)
console.log(array)