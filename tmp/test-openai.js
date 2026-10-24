(async () => {
  const key = process.env.OPENAI_API_KEY;
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: 'Bearer ' + key },
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text.slice(0, 300));
})();
