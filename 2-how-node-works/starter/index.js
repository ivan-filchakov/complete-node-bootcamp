const fs = require("fs")
const crypto = require("crypto")
const EventEmitter = require("events")
const http = require("http")
const url = require("url")

console.log(require("module").wrapper)

const server = http.createServer()
server.on("request", (req, res) => {
    // 1
    // fs.readFile("test-file.txt", (err, data) => {
    //     if (err) console.error(err)
    //     res.end(data)
    // })

    // 2 stream
    // const readable = fs.createReadStream("test-file.txt")
    // readable.on ("data", chunk => {
    //     res.write(chunk)
    // })
    // readable.on("end", () => {
    //     res.end
    // })
    // readable.on("error", err => {
    //     console.error(err)
    //     res.statusCode = 500
    //     res.end("error")
    // })

    // 3 Pipe
    const readable = fs.createReadStream("test-file.txt")
    readable.pipe(res)
})

server.listen(8888, "127.0.0.1", () => {
    console.info("listening...")
})


/** =========================== */
// class Sales extends EventEmitter {
//     constructor() {
//         super();
//     }
// }
// const myEmitter = new Sales()

// const test = "test?S"

// myEmitter.on("sale", () => {
//     console.log("Event Fired!")
// })

// myEmitter.on("sale", () => {
//     console.log("New Customer!")
// })

// myEmitter.on("sale", (wat, the, fuck) => {
//     console.log(`There are now ${wat} items left`)
// })
// myEmitter.emit("sale", 9, 10)


/** =========================== */
// const server = http.createServer()
// server.on("request", (req, res) => {
// 	const { pathname, query, path } = url.parse(req.url, true);
//     if (pathname === "/favicon.ico") {
//         return
//     }
//     console.log(`request recieved 1`)
//     res.end("recieved 1")
// })
// server.on("request", (req, res) => {
//     console.log(`request recieved 2`)
//     // res.end("recieved 2")
// })
// server.on("close", (req, res) => {
//     console.log(`CLOSED`)
// })
// server.listen(8888, "127.0.0.1", () => {
//     console.log("waiting for reqest...")
// })


/** =========================== */
// process.env.UV_THREADPOOL_SIZE = 2
// const start = Date.now()
// setTimeout(() => console.log("Timer 111"), 0);

// setImmediate(() => console.log("Immediate 111"));

// fs.readFile("test-file.txt", () => {
//     console.log("IO FINISHED")

//     setTimeout(() => console.log("Timer 222"), 0);
//     setTimeout(() => console.log("Timer 333"), 3000);
//     setImmediate(() => console.log("Immediate 222"));

//     process.nextTick(() => console.log("NEXT TICK"));

//     crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//         console.log(Date.now() - start, "Password encrypted");
//     })
//     crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//         console.log(Date.now() - start, "Password encrypted 2");
//     })
//     crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//         console.log(Date.now() - start, "Password encrypted 3");
//     })
//     crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//         console.log(Date.now() - start, "Password encrypted 4");
//     })
//     crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
//         console.log(Date.now() - start, "Password encrypted 5");
//     })
// });

// console.log("Hello from the top-level code");