let async = require('async');

let v1 = 0
let v2 = 0
let v3 = 0

console.log("begin")

let task1 =function(callback){  
    console.log("task1");
    v1 = "task1"
    setTimeout(()=>{console.log("task1 over");callback(null, "task1")}, 100)
}

let task2 =function(callback){
    console.log("task2");
    v2 = "task2"
    setTimeout(()=>{console.log("task2 over"); callback(null, "task2")}, 50)
}

let task3 =function(callback){
    console.log("task3");
    v3 = "task3"
    setTimeout(()=>{console.log("task3 over"); callback(null, "task3")}, 1)
}

let task4 = function(param1, param2) {
    return function(cb) {
        console.log(`param1 ${param1}. param2 ${param2}`)
        cb(null, "task4 work success")
    }
}

// 串行执行范例, 按function顺序有序执行,上一个function执行完才执行下一个function
// async.series本身是非阻塞的
// console.time("async.series")
// async.series({task1,task2,task3},function(err,result){ 
//     if (err) {
//         console.log(err); 
//     }   
//     console.log(result); 
// })
// console.log(`after async.series v1:${v1}  v2:${v2}  v3:${v3}`)
// console.timeEnd("async.series")



// 并行执行范例，所有function并行执行
// async.parallel本身非阻塞
// console.time("async.parallel")
// let func = task4(1,2)
// async.parallel({task1,task2,task3, func},function(err,result){ 
//     if (err) {
//         console.log(err); 
//     }
//     console.log(result); 
// })
// console.log(`after async.parallel v1:${v1}  v2:${v2}  v3:${v3}`)
// console.timeEnd("async.parallel")



// 瀑布执行范例，所有function顺序有序执行,上一个function执行完才执行下一个function
// async.waterfall本身是非阻塞的
console.time("async.waterfall")
async.waterfall([       // 此处不能是object，只能是array
    function (callback) {
        callback(null, ["one"]);
    },
    function (arg, callback) {
        arg.push("two")
        callback(null, arg);
    },
    function (arg, callback) {
        arg.push("three")
        callback(null, arg);
    },
    function (arg, callback) {
        arg.push("four")
        setTimeout(()=>{callback(null, arg)}, 1000);
    }
], function (error, result) {
    console.log(result);
})
console.timeEnd("async.waterfall")
