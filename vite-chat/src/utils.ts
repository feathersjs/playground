const sleep = (s: number) => new Promise((r) => setTimeout(r, (s * 1000) | 0))

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
