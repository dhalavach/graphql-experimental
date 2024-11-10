// A variation of Jaro Distance that increases similarity for strings with matching prefixes,
// giving higher similarity scores to strings that have common starting sequences.

export function jaroWinkler(s1, s2) {
  const jaroDistance = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    if (len1 === 0) return len2 === 0 ? 1.0 : 0.0;

    const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
    let matches = 0;
    let transpositions = 0;
    const s1Matches = Array(len1).fill(false);
    const s2Matches = Array(len2).fill(false);

    // Find matches
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, len2);
      for (let j = start; j < end; j++) {
        if (s2Matches[j]) continue;
        if (str1[i] !== str2[j]) continue;
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) return 0.0;

    // Count transpositions
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!s1Matches[i]) continue;
      while (!s2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }
    transpositions /= 2;

    // Jaro distance formula
    return (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3;
  };

  const jaro = jaroDistance(s1, s2);

  // Winkler modification: boost for common prefix
  const prefixLength = 4;
  let prefixMatch = 0;
  for (let i = 0; i < Math.min(prefixLength, s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) prefixMatch++;
    else break;
  }

  const p = 0.1; // scaling factor for Winkler modification
  return jaro + prefixMatch * p * (1 - jaro);
}

// Example usage:
console.log(jaroWinkler('MARTHA', 'MARHTA')); // Output close to 0.961
console.log(jaroWinkler('DWAYNE', 'DUANE')); // Output close to 0.84
console.log(jaroWinkler('DIXON', 'DICKSONX')); // Output close to 0.813
