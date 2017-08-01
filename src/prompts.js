import { isAbsolute, relative } from 'path'
import type { InquirerFile } from './types'

export const controller = (files: InquirerFile[]): {} => ({
  type: 'autocomplete',
  name: 'controller',
  message: 'Which controller do you want to replicate?',
  source: (_, input) =>
    Promise.resolve(
      files.filter(
        file =>
          !input || file.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    )
})

export const name = (originalName: string): {} => ({
  type: 'input',
  name: 'name',
  message: `How do you want to name ${originalName} controller?`,
  default: originalName
})

export const folder = (originalFolder: string): {} => ({
  type: 'input',
  name: 'folder',
  message: answers =>
    `In which folder do you want to put ${answers.name} controller?`,
  default: originalFolder,
  filter: input => (isAbsolute(input) ? relative(process.cwd(), input) : input)
})
