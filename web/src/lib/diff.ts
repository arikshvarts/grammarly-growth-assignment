export function wordKey(w: string) {
    return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function diffHighlight(original: string, rewritten: string) {
    const orig = original.trim().split(/\s+/);
    const newW = rewritten.trim().split(/\s+/);
    const m = orig.length;
    const n = newW.length;

    // LCS dynamic programming
    const dp: number[][] = [];
    for (let i = 0; i <= m; i++) { 
        dp[i] = []; 
        for (let j = 0; j <= n; j++) dp[i][j] = 0; 
    }
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = wordKey(orig[i-1]) === wordKey(newW[j-1])
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }

    // Backtrack to find LCS indices in new[]
    const inLCS: Record<number, boolean> = {};
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (wordKey(orig[i-1]) === wordKey(newW[j-1])) { 
            inLCS[j-1] = true; 
            i--; 
            j--; 
        }
        else if (dp[i-1][j] > dp[i][j-1]) i--;
        else j--;
    }

    const parts = [];
    for (let k = 0; k < newW.length; k++) {
        if (inLCS[k]) {
            parts.push({ text: newW[k], highlight: false });
        } else {
            parts.push({ text: newW[k], highlight: true });
        }
    }
    return parts;
}
