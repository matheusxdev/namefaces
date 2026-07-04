import { exec } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const file = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../playground/index.html',
)

const command =
  process.platform === 'win32'
    ? `start "" "${file}"`
    : process.platform === 'darwin'
      ? `open "${file}"`
      : `xdg-open "${file}"`

exec(command, (error) => {
  if (error) {
    console.log(`Abra manualmente: ${file}`)
    return
  }
  console.log(`Preview aberto: ${file}`)
})
