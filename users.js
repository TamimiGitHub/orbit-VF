import fetch from "node-fetch"
import OrbitMembers from "@orbit-love/members"
import 'dotenv/config'

async function getUsers(page, orbitMembers) {
  const baseURL = `https://solace.community/api/v2/users?expand=extended&dateInserted=>2021-12-08&page=${page}`;
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
    throw new Error(`No tags in ${page}`);
  }

  var filtered = body.filter( user => user.countDiscussions == 0 && user.countComments == 0 && user.countPosts == 0)
  console.log(filtered)

}

const orbitWorkspaceId = process.env["ORBIT_WORKSPACE"] || "solace-staging"
const orbitMembers = new OrbitMembers(orbitWorkspaceId, process.env["ORBIT_TOKEN"])

// let content = ['name','email','github','twitter','linkedin','discorse','company','avatar_url','tags','teammate','title','\n'];
// fs.appendFile("NewUsers.csv", content)

for (let page = 0; page < 5; page++) {
    getUsers(page, orbitMembers);
  }