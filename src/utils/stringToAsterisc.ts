export function stringToAsterisc(s: string) {
  let newAsteriscString = "";
  for (let i = 0; i < s.length; i++) {
    newAsteriscString += "*";
  }
  return newAsteriscString;
}
