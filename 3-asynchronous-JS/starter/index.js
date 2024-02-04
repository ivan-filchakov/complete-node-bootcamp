const fs = require("fs");
const superagent = require("superagent");

// fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.error(err);
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return console.error(err);
//         debugger;
//       });
//     });
// });

// fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return console.error(err);
//         debugger;
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) reject("I could not find that file 😅");
      const test = new Date();
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file 😅");
      resolve("success");
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((result) => {
//     return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
//   })
//   .then((result) => {
//     return writeFilePro("dog-img.txt", result.body.message);
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`)
        const res1Pro = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
        const res2Pro = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
        const res3Pro = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
        const all = await Promise.all([res1Pro, res2Pro, res3Pro])
        const imgs = all.map(el => el.body.message)
        const result = imgs.join('\n')
        await writeFilePro('dog-img.txt', result)
    } catch (err) {
        console.error(err)
    }
}

getDogPic()