let allRoutes = []

// Allow us to dynamically require all files.
// https://webpack.js.org/guides/dependency-management/#require-context
const requireRoute = require.context(
    // Search for files in the current directory.
    '.',
    // Search for files in subdirectories.
    true,
    // Include any .js files that are not this file or a unit test.
    /^((?!index|\.unit\.).)*\.js$/
)

// For every Route module...
requireRoute.keys().forEach((fileName) => {

    // Get the path and remove the file extension from the end.
    const routePath = fileName.replace(/\.\w+$/, '')

    require(`${routePath}`).default.forEach(item => {
        allRoutes.push(item)
    })
})

export default allRoutes
