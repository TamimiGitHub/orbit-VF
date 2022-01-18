import fetch from "node-fetch"
import alphabet from "alphabet"
import fs from "fs"
import 'dotenv/config'

// Gets list of tags given a letter

async function getTags(letter) {
  const baseURL = `https://solace.community/api/v2//tags?query=${letter}`;
  const header_config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env["VF_PRODUCTION_TOKEN"]}`,
    },
  };

  let res = await fetch(baseURL, header_config).catch((err) => {
    throw new Error(`Error fetching content from ${baseURL}. ${err}`);
  });

  if (!res.ok) {
    throw new Error(`Response status from ${baseURL}: ${res.status}`);
  }

  let body = await res.json();

  if (body.length === 0) {
    throw new Error(`No tags in ${letter}`);
  }

  // CSV list 
  let content = []

  body.map((tag) => {
    content.push(`${tag.name}, ${tag.id}\n`);
  });

 content.forEach((l) => {
    fs.appendFile("tags.csv", l, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
}

alphabet.upper.forEach((alpha) => {
    getTags(alpha)
})