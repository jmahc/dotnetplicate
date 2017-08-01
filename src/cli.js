#!/usr/bin/env node
/* eslint-disable no-console */
import { join, relative, isAbsolute, dirname, basename } from 'path'
import { copy, move, readFileSync, writeFileSync } from 'fs-extra'
import { cyan, green, red } from 'chalk'
import meow from 'meow'
import inquirer from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
import ora from 'ora'
import { controller, name, folder } from './prompts'
import {
  getControllerName,
  getControllerFolder,
  isSingleFile,
  getFiles,
  getControllerFiles,
  replaceContents
} from './utils'

const cli = meow(`
  Usage
    $ dotnetplicate [path]

  Options
    --root Sets the root path to scan for controller or repository files.

  Examples
    $ dotnetplicate
    $ dotnetplicate src/Repositories/TestRepository.cs
    $ dotnetplicate --root src/Repositories
`)

const replicate = async path => {
  const originalName = getControllerName(path)
  const absolutePath = isAbsolute(path) ? path : join(process.cwd(), path)
  const relativePath = relative(process.cwd(), absolutePath)
  const originalFolder = getControllerFolder(relativePath)
  const promises = []

  const answers = await inquirer.prompt([
    name(originalName),
    folder(originalFolder)
  ])

  if (isSingleFile(path)) {
    const files = getFiles(dirname(absolutePath), originalName)

    files.forEach(async file => {
      const filename = basename(file).replace(originalName, answers.name)
      const destinationPath = join(process.cwd(), answers.folder, filename)
      const promise = copy(file, destinationPath).then(() => {
        const contents = readFileSync(destinationPath).toString()
        writeFileSync(
          destinationPath,
          replaceContents(contents, originalName, answers.name)
        )
      })
      promises.push(promise)
    })
  } else {
    const destinationPath = join(process.cwd(), answers.folder, answers.name)
    await copy(dirname(absolutePath), destinationPath)
    const files = getFiles(destinationPath)

    files.forEach(file => {
      const contents = readFileSync(file).toString()
      const renamedPath = join(
        dirname(file),
        basename(file).replace(originalName, answers.name)
      )
      writeFileSync(file, replaceContents(contents, originalName, answers.name))
      const promise = move(file, renamedPath)
      promises.push(promise)
    })
  }
  await Promise.all(promises)
}

const scan = async (root = process.cwd()) => {
  const absoluteRoot = isAbsolute(root) ? root : join(process.cwd(), root)
  const spinner = ora(
    `Scanning ${green(
      absoluteRoot
    )} for CSharp controller and repository files...`
  ).start()
  const files = await getControllerFiles(absoluteRoot)
  spinner.stop()

  if (!files.length) {
    console.log(red.bold('No controllers or repositories found! :(\n'))
    console.log(
      `Make sure you are running ${cyan(
        'dotnetplicate'
      )} inside a dotnetcore project directory or using ${green(
        'root'
      )} option:\n`
    )
    console.log(
      `    ${cyan('$ dotnetplicate')} ${green(
        '--root relative/or/absolute/path/to/any/dotnetcore/project'
      )}\n`
    )
    console.log(
      `If you are already doing that, it means that ${cyan(
        'dotnetplicate'
      )} could not find your controller or repository files automagically.`
    )
    console.log(
      'In this case, you can explicitly pass the controller or repository path to replicate:\n'
    )
    console.log(
      `    ${cyan('$ generact')} ${green(
        'relative/or/absolute/path/to/my/dotnetcore/controller.cs'
      )}\n`
    )
    return process.exit(1)
  }

  inquirer.registerPrompt('autocomplete', autocomplete)
  const answers = await inquirer.prompt([controller(files)])
  return answers.controller
}

if (cli.input.length) {
  replicate(cli.input[0])
} else {
  scan(cli.flags.root).then(replicate)
}
