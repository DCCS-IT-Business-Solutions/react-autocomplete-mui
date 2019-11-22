export function stringCompare(a: string, b: string) {
  if (a === b) {
    return true;
  }
  if (a.toLowerCase().includes(b.toLowerCase())) {
    return true;
  }
  return false;
}
