var array = [6, 12, 33, 87, 90, 97, 108, 561]

// 递归实现
function binarySearch(array, target, low, high) {
    low = low === undefined ?  0 : low
    high = high === undefined ?  (array.length - 1) : high
    if(low <= high){
        var middle = Math.floor((low + high) / 2)
        if(array[middle] < target){
            return binarySearch(array, target, middle + 1, high)
        } else if(array[middle] > target){
            return binarySearch(array, target, low, middle - 1)
        } else {
            return middle
        }
    }
    return -1;
}

// 迭代实现
function binarySearch2(array, target) {
    var low = 0, high = array.length - 1, middle
    while(low <= high){
        middle = Math.floor((high - low) / 2)
        if(target < array[middle]){
            high = middle - 1
        } else if(target > array[middle]){
            low = middle + 1
        } else {
            return middle
        }
    }
    return -1
}
console.log(binarySearch2(array, 12))