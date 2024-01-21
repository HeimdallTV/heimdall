/**
 * FFZ's codebase uses the internal Twitch Apollo Client
 * by hooking into the React instance here:
 * https://github.com/FrankerFaceZ/FrankerFaceZ/blob/e8bb25f982ca7d8babef73550c414c7c8c6105fc/src/utilities/compat/fine.ts#L114
 * and then looking for the GQL client in the props here:
 * https://github.com/FrankerFaceZ/FrankerFaceZ/blob/e8bb25f982ca7d8babef73550c414c7c8c6105fc/src/utilities/compat/apollo.js#L89
 * So we implement a simple version of this
 */
// @ts-nocheck
const getReactRoot = () => document.querySelector('#root')._reactRootContainer._internalRoot.current

function findInReactTree(predicate, node) {
  if (predicate(node)) return node
  const children = []
  let child = node.child
  while (child) {
    children.push(child)
    child = child.sibling
  }
  for (const child of children) {
    const node = findInReactTree(predicate, child)
    if (node) return node
  }
}

const client = findInReactTree(node => node?.memoizedProps?.client, getReactRoot()).memoizedProps.client

console.log(client.queryManager.queries)
