const fs = require("fs");
const path = require("path");

var srt2vtt = require("srt-to-vtt");
var FormData = require("form-data");
const CronJob = require("cron").CronJob;

readStream = (subtitlePath, subVTT) => {
  return new Promise((resolve, reject) => {
    var newSub = fs.createReadStream(subtitlePath).pipe(srt2vtt()).pipe(fs.createWriteStream(subVTT));

    const job = new CronJob(
      "30 59 2 * * *", // Tous les jours a 03:00
      () => {
        newSub.close();
      },
      null,
      true,
      "Europe/Paris",
    );

    job.start();

    newSub.on("close", () => {
      resolve(newSub);
    });

    newSub.on("error", (error) => {
      reject(error);
    });
  });
};

exports.forReadStream = (subs, fullPath) => {
  return new Promise((resolve, reject) => {
    var form = new FormData();

    (async function loop() {
      for (const s of subs) {
        var name = s.split(".")[0];
        var fileName = s.split(".")[1];
        const subtitlePath = path.join(fullPath, "Subs", s);
        const subVTT = subtitlePath.replace(".srt", ".vtt");

        const newSub = await readStream(subtitlePath, subVTT);
        if (path.extname(subVTT) === ".vtt") {
          var readS = fs.readFileSync(subVTT);
          form.append(name, readS, fileName + ".vtt");
          // console.log(subVTT, subs);
          // console.log(s, subs[subs.length - 1]);
          if (s === subs[subs.length - 1]) {
            // console.log(newSub);
            resolve(form);
            // newSub.on("close", () => {
            //   console.log("nous somme dans le on finish");
            // });
          }
        }
      }
    })();

    // for (const s of subs) {
    //   var name = s.split(".")[0];
    //   var fileName = s.split(".")[1];
    //   const subtitlePath = path.join(fullPath, "Subs", s);
    //   const subVTT = subtitlePath.replace(".srt", ".vtt");
    //   // var newSub = fs.createReadStream(subtitlePath).pipe(srt2vtt()).pipe(fs.createWriteStream(subVTT));

    //   // newSub.on("close", () => {

    //   readStream(subtitlePath, subVTT)
    //     .then((newSub) => {
    //       if (path.extname(subVTT) === ".vtt") {
    //         var readS = fs.readFileSync(subVTT);
    //         form.append(name, readS, fileName + ".vtt");
    //         // console.log(subVTT, subs);
    //         console.log(s, subs[subs.length - 1]);
    //         if (s === subs[subs.length - 1]) {
    //           newSub.on("finish", () => {
    //             console.log("nous somme dans le on finish");
    //           });
    //           console.log("je suis le dernier stream");
    //         }
    //       }
    //     })
    //     .catch((error) => console.error(error));
    // });
    // }
  });
};
