const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(cors({
    domains: '*',
    methods: '*'
}));

app.get('/Tipocambio', function (req, res) {
    if (req.query.type == 'eur') {
        res.json({
            "TipoCompraEuros": "731.85",
            "TipoVentaEuros": "761.9"
        })
    } else if (req.query.type == 'usd') {
        res.json({
            "TipoCompraDolares": "621",
            "TipoVentaDolares": "621"
        })
    } else {
        res.json({
            "TipoCompraEuros": "731.85",
            "TipoVentaEuros": "761.9",
            "TipoCompraDolares": "621",
            "TipoVentaDolares": "621"
        })
    }
})

app.listen(3001, () => console.log('BBCR Exchange type service listening on port 3001!'));