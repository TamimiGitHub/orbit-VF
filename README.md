# Orbit VF Users

## Prerequisites
- Create a `.env` file in the root of your directory
- Add the following tokens as the content of the file
    ```
    VF_PRODUCTION_TOKEN = <Vanilla Forum Token>
    ORBIT_TOKEN = <Orbit Token>
    ORBIT_WORKSPACE = <Name of orbit workspace> # Obtained from https://app.orbit.love/<ORBIT_WORKSPACE>
    ```

## How to run
1. `npm i`
1. Add users to Orbit: `node users.js` 

## Resources
To find our what you can do with the Orbit Members Helper Library for Node.js checkout the docs
https://www.npmjs.com/package/@orbit-love/members