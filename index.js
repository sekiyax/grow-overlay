
const express = require("express");
const app = express();
const port = 3000;

let latestData = {}; // Menyimpan data terakhir dari webhook

app.use(express.json());

// Endpoint webhook dari script Roblox
app.post("/webhook", (req, res) => {
  const data = req.body;
  latestData = data;
  console.log("Data diterima dari webhook:");
  console.log(JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

// Endpoint overlay OBS
app.get("/overlay", (req, res) => {
  const html = `
    <html>
    <head>
      <title>Grow A Garden Overlay</title>
      <style>
        body {
          font-family: sans-serif;
          background: #111;
          color: #fff;
          padding: 20px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .category {
          margin-bottom: 20px;
        }
        .field {
          margin-left: 10px;
          color: #90ee90;
          white-space: pre-line;
        }
      </style>
    </head>
    <body>
      <h1>Grow A Garden Stock Overlay</h1>
      ${renderFields(latestData)}
    </body>
    </html>
  `;
  res.send(html);
});

function renderFields(data) {
  if (!data.embeds) return "<p>Menunggu data dari webhook...</p>";
  return data.embeds
    .map((embed) => {
      return embed.fields
        .map(
          (field) => `
          <div class="category">
            <h2>${field.name}</h2>
            <div class="field">${field.value}</div>
          </div>
        `
        )
        .join("");
    })
    .join("");
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server berjalan di http://0.0.0.0:${port}`);
});
