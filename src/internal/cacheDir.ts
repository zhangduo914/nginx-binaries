import * as FS from 'fs'
import * as OS from 'os'
import * as path from 'path'


export function getCacheDir (name: string): string {
  const nodeModules = findPkgNodeModules(process.cwd())

  const cacheDir = nodeModules
    ? path.join(nodeModules, '.cache', name)
    : path.join(OS.tmpdir(), name)

  FS.mkdirSync(cacheDir, { recursive: true })

  return cacheDir
}

function findPkgNodeModules (cwd: string): string | null {
  let dir = path.resolve(cwd)
  const rootDir = path.parse(dir).root

  while (dir !== rootDir) {
    const nodeModules = path.join(dir, 'node_modules')
    if (isWritableDir(nodeModules)) {
      return nodeModules
    }
    dir = path.dirname(dir)
  }
  return null
}

function isWritableDir (path: string): boolean {
  try {
    if (!FS.statSync(path).isDirectory()) {
      return false
    }
    FS.accessSync(path, FS.constants.W_OK)
    return true
  } catch {
    return false
  }
}
