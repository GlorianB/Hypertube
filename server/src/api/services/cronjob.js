const CronJob = require("cron").CronJob;

const removeDir = require("../utils/removeDir");

const pathToMovies = process.cwd() + "/Movies";

const job = new CronJob(
  "0 3 * * *", // Tous les jours a 03:00
  () => {
    removeDir(pathToMovies);
  },
  null,
  true,
  "Europe/Paris",
);

// console.log("AUTODELETE JOB STARTED");

module.exports = job;
