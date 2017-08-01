// @flow

import { gray } from 'chalk'
import glob from 'glob'
import { camelCase, upperFirst } from 'lodash'
import { dirname, join, relative } from 'path'

import listCSharpFiles from './list-csharp-files'
import type { InquirerFile } from './types'

const removeExt = path => path.replace(/\.[^.]+$/, '')

export const getControllerName = (path: string): string =>
  path.split('/').reduce((name, part) => {
    if (/^[A-Z]/.test(part)) {
      return removeExt(part)
    } else if (/^((?!index).+)\.[^.]+$/.test(part)) {
      return upperFirst(camelCase(removeExt(part)))
    }
    return name
  }, '')

export const getControllerFolder = (path: string): string => {
  const name = getControllerName(path)
  return dirname(path).split('/').reduce((folder, part) => {
    if (removeExt(part) === name) {
      return folder
    }
    return join(folder, part)
  }, './')
}

export const isSingleFile = (path: string): boolean => {
  const name = getControllerName(path)
  const [dir] = dirname(path).split('/').reverse()

  return dir !== name
}

export const getFiles = (cwd: string, controllerName?: string): string[] => {
  const extensions = '{cs}'
  const pattern = controllerName ? `**/${controllerName}{.,.*.}${extensions}` : `**/*.${extensions}`

  return glob.sync(pattern, { cwd, absolute: true, nodir: true })
}

export const getControllerFiles = (root: string): Promise<InquirerFile[]> => {
  listCSharpFiles(root).then((files: string[]) =>
    files.map((path: string): InquirerFile => {
      const name = getControllerName(path)
      const absolutePath = join(root, path)
      const relativePath = relative(process.cwd(), absolutePath)

      return {
        name: `${name} ${gray(relativePath)}`,
        short: name,
        value: absolutePath
      }
    })
  )
}

export const replaceContents = (contents: string, oldName: string, newName: string): string =>
  contents.replace(
    new RegExp(`([^a-zA-Z0-9_$])${oldName}([^a-zA-Z0-9_$]|Container)`, 'g'),
    `$1${newName}$2`
  )
