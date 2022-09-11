// Sleep, with protection against accidentally forgetting to use await!
export const sleep = (s: number, quiet?: boolean) => {
  const sleepId = 'SLEEP_' + Date.now()
  const G = globalThis as any
  if (G[sleepId] === true && !quiet) {
    console.error('Did you call sleep without await? use quiet to hide msg.')
  } else {
    G[sleepId] = true
  }
  return new Promise((resolve) => {
    !quiet &&
      setTimeout(() => {
        delete G[sleepId]
      }, 1)
    setTimeout(resolve, (s * 1000) | 0)
  })
}

export const printNodeModulesAge = async () => {
  const { stat, writeFile, readFile } = await import('node:fs/promises')
  const modulesPath = 'node_modules'
  const lockFile = `${modulesPath}/printNodeModuleAge.lock`
  try {
    const elapsedS = parseInt(await readFile(lockFile, { encoding: 'utf-8' }))
    return elapsedS
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e
    }
    const nodeModulesStats = await stat(modulesPath)
    const bDate = new Date(nodeModulesStats.birthtime)
    const elapsedS = ((Date.now() - bDate.getTime()) / 1000) | 0
    console.log(`Time since birth: ${elapsedS}s`)

    writeFile(
      `${modulesPath}/printNodeModuleAge.lock`,
      new Date().toISOString()
    )
    return elapsedS
  }
}
