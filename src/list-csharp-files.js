// @flow
import glob from 'glob'

const globs = {
  camelCaseFile: '[A-Z]*.{cs}',
  camelCaseDir: '[A-Z]*/{index,[A-Z]*}.{cs}'
}

/**
 * List csharp files inside a directory
 */
const listCSharpFiles = (cwd: string): Promise<string[]> => {
  const patterns = Object.keys(globs).map(key => globs[key])
  const pattern = `**/{${patterns.join(',')}}`
  const ignore = ['**/node_modules/**', '**/{__tests__,test,tests}/**', '**/*.{test,spec}.*']

  return new Promise((resolve, reject) => {
    glob(pattern, { cwd, ignore }, (err, files) => {
      // istanbul ignore next
      if (err) {
        reject(err)
      }
      resolve(files)
    })
  })
}

export default listCSharpFiles
