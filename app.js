const puppeteer = require("puppeteer");
const fs = require("fs");

const getMovies = async function(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(url);

  // get hotel details
  let lusomundoData = await page.evaluate(() => {
    let movies = [];
    // get the hotel elements
    let movieElms = document.querySelectorAll("article.items__one");
    // get the hotel data
    movieElms.forEach(movieElement => {
      let movieJson = {};
      try {
        movieJson.title = movieElement.querySelector("span.title").innerText;
        movieJson.movieUrl = movieElement.querySelector("a.item-image").href;
        movieJson.imgUrl = movieElement.querySelector("img").src;
      } catch (exception) {
        console.log("An unhandled exception was found");
      }
      movies.push(movieJson);
    });
    return movies;
  });

  return lusomundoData;
};

const getMovieSchedule = async function(url) {
  console.log(`Entered ${url}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });
  await page.goto(url);

  // get movie details
  let movieData = await page.evaluate(() => {
    let schedules = [];
    // get the movie elements
    let movieElms = document.querySelectorAll("article.line");

    movieElms.forEach(movieElement => {
      let scheduleJson = {};
      try {
        scheduleJson.cinema = movieElement.querySelector(
          "div.cinema"
        ).innerText.replace('\n', '').trim();;
        scheduleJson.room = movieElement.querySelector("div.room").innerText.replace('\n', '').trim();
        hourElements = movieElement.querySelectorAll("a");

        //Get hours for each cinema
        let hours = [];
        hourElements.forEach(hourElement => {
          hours.push({ hour: hourElement.innerText.substring(0,5) });
        });
        scheduleJson.hours = hours;
      } catch (exception) {
        console.log("An unhandled exception was found");
      }
      schedules.push(scheduleJson);
    });
    return schedules;
  });

  return movieData;
};

const removeDataGarbage = function (data) {
  return data.replace('\n', '').trim();
}

const writeDataToJson = function(jsonObj) {
  // parse json

  // stringify JSON Object
  var jsonContent = JSON.stringify(jsonObj);
  console.log(jsonContent);

  fs.writeFile("output.json", jsonContent, "utf8", function(err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
};

/***
 * Data cleaning of movies web scrapping
 */
const dataCleaning = function(data) {
    for (const movie of data) {
    }

  return newData;
};

let url = "http://cinemas.nos.pt/pages/cartaz.aspx";

// Start function
const start = async function(url) {
  const movies = await getMovies(url);

  for (const movie of movies) {
    const movieSchedules = await getMovieSchedule(movie.movieUrl);
    movie.schedules = movieSchedules;

    //TODO: For some reason after some cycles it throws an unwatched error. Got work to do ;-)
  }

  console.log(movies);
  writeDataToJson(movies);
};

// Call start
start(url);
