export async function handleCopyToClipboard(summary, setCopied){
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
}