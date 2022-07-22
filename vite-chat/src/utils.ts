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
