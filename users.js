import fetch from "node-fetch"
import OrbitMembers from "@orbit-love/members"
import OrbitActivities from "@orbit-love/activities"
import 'dotenv/config'

// This scripts queries all the users from VF with zero activities
// Add users as members to Orbit
// Create activity for join date in Orbit

async function getUsersWithNoActivities(page, orbitMembers, orbitActivities) {
  const baseURL = `https://solace.community/api/v2/users?expand=extended&dateInserted=>2021-12-08&page=${page}`;
  const header_config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${
        process.env["VF_PRODUCTION_TOKEN"]
      }`
    }
  };

  let res = await fetch(baseURL, header_config).catch((err) => {
    throw new Error(`Error fetching content from ${baseURL}. ${err}`);
  });

  if (! res.ok) {
    throw new Error(`Response status from ${baseURL}: ${
      res.status
    }`);
  }

  // List of users
  let body = await res.json();

  if (body.length === 0) {
    throw new Error(`No tags in ${page}`);
  }

  // Get users with zero discussions, comments, posts
  body.filter(user => user.countDiscussions == 0 && user.countComments == 0 && user.countPosts == 0).map(user => {
    // Create an orbit member object
    // As per https://docs.orbit.love/reference/post_-workspace-id-members
    var data = {
      member: {
        twitter: user.extended.Twitterhandleoptional || null,
        name: user.extended.FirstName && user.extended.LastName ? `${
          user.extended.FirstName
        } ${
          user.extended.LastNames
        }` : null,
        company: user.extended.CompanyName || null,
        title: user.extended.JobTitleoptional || null,
        linkedin: user.extended.LinkedInprofileoptional || null,
        email: user.email || null,
        avatar_url: user.profilePhotoUrl || null,
        tags: ['VF']
      }
    }
    // Create member
    orbitMembers.createMember(data).then(member => {
      var act = {
        activity_type: 'VF:JoinDate',
        title: "Join date on the Forum",
        occurred_at: user.dateInserted
      }
      // Create an orbit member activity
      // As per https://docs.orbit.love/reference/post_-workspace-id-activities
      orbitActivities.createActivity(member.data.id, act).then(result => {
        // Print activity creation response
        // console.log(result)
      }).catch(error => {
        console.error(error)
      })
      // Print member creation response
      // console.log(member)
    }).catch(error => {
      console.error(error)
    })
  })
}

const orbitWorkspaceId = process.env["ORBIT_WORKSPACE"] || "solace-staging"
const orbitMembers = new OrbitMembers(orbitWorkspaceId, process.env["ORBIT_TOKEN"])
const orbitActivities = new OrbitActivities(orbitWorkspaceId, process.env["ORBIT_TOKEN"])

for (let page = 1; page < 5; page++) {
  getUsersWithNoActivities(page, orbitMembers, orbitActivities);
}
