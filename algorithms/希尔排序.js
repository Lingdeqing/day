function sort(array) {
    var len = array.length
    var h = 1
    while (h < Math.floor(len / 3)) h = 3 * h + 1  // 1，4，13，40，...
    while (h >= 1) {
        for (var i = h; i < len; i++) {
            for (var j = i; j >= h && array[j] < array[j - h]; j -= h) {
                var temp = array[j]
                array[j] = array[j - h]
                array[j - h] = temp
            }
        }
        h = Math.floor(h/3)
    }
}

var array = [22, 14, 23, 15, 2, 23, 25, 17, 12]
sort(array)
console.log(array)