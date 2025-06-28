export async function handleSummarizeAPI({
  endPoint,
  payload,
  setSummary,
  setError,
  setLoading,
  triggerScroll,
}) {
  setLoading(true);
  setSummary("");
  setError("");

  try {
    const res = await fetch(endPoint, {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setSummary(data.summary);
      if (triggerScroll) triggerScroll(true);
    } else {
      setError(data.error || "Failed to summarize");
    }
  } catch (error) {
    setError("Failed to connect to Server");
  }finally{
    setLoading(false);
  }
}
