//const browserify = require('browserify');
// const serveStatic = require('serve-static')
//const fs = require('fs');
// const express = require('express');
// const request = require('request');
// const  http = require('http').Server(app);
// const io = require('socket.io')(http);
//const config = require('./src/config');
// const app = express();
let app = require('./index');


let config = {
  dashboards: [
    {
      cols: 6,
      rows: 6,
      time: 10000,
      tiles: [
        {
          id: "email_attese",
          type: "list",
          x: 0, y: 0,
          cols: 2, rows: 3,
          title: "Email attese",
          stretch: false,
          url: "https://api.finanza.tech/wallboard/email_attese",
          poll_rate: 900000,
        },
        {
          id: "non_assegnate",
          x: 0, y: 3,
          cols: 2, rows: 2,
          type: "list",
          title: "Pratiche da assegnare",
          url: "https://api.finanza.tech/wallboard/pratiche_not_assigned",
          poll_rate: 300000,
        },

        {
          id: "subscriptions",
          type: "value_multi",
          x: 2, y: 0,
          cols: 2, rows: 3,
          title: "Sottoscrizioni",
          stretch: true,
          url: "https://api.finanza.tech/wallboard/num_subscription",
          poll_rate: 900000,
        },
        {
          id: "mandati_firmati",
          type: "value_multi",
          x: 4, y: 0,
          cols: 1, rows: 2,
          title: "Mandati firmati",
          stretch: false,
          url: "https://api.finanza.tech/wallboard/mandati_firmati",
          poll_rate: 900000,
        },
        {
          id: "subscription_expire",
          type: "rings",
          x: 2, y: 3,
          cols: 2, rows: 2,
          title: "Subscriptions Expires",
          stretch: false,
          url: "https://api.finanza.tech/wallboard/subscription_expire",
          poll_rate: 3600000,
        },
        {
          id: "gioia_del_giorno",
          type: "quote",
          x: 0, y: 5,
          cols: 6, rows: 1,
          title: "Gioia del giorno",
          url: "https://api.finanza.tech/wallboard/gioia_del_giorno",
          poll_rate: 3600000,
        },
        {
          id: "op_namirial",
          type: "value",
          x: 5, y: 0,
          cols: 1, rows: 2,
          title: "Op Namirial",
          stretch: true,
          url: "https://api.finanza.tech/wallboard/operatore_namirial",
          poll_rate: 1800000,
        },
      ]
    },
    {
      cols: 3,
      rows: 4,
      time: 10000,
      tiles: [
        {
          id: "opp_analista",
          x: 0, y: 0,
          cols: 2, rows: 2,
          type: "barchart_v_stack",
          title: "Opportunità per Analista",
          url: "https://api.finanza.tech/wallboard/analisti_opportunita",
          poll_rate: 300000,
        },
        {
          id: "prat_analista",
          x: 1, y: 2,
          cols: 2, rows: 2,
          type: "barchart_v_stack",
          title: "Pratiche per Analista",
          url: "https://api.finanza.tech/wallboard/analisti_pratiche",
          poll_rate: 300000,
        },
        {
          id: "peggio_pratiche",
          x: 2, y: 0,
          cols: 1, rows: 2,
          type: "list_lights",
          title: "Pratiche da lavorare",
          url: "https://api.finanza.tech/wallboard/pratiche_urgenti",
          poll_rate: 300000,
        },
        {
          id: "peggio_opportunita",
          x: 0, y: 2,
          cols: 1, rows: 2,
          type: "list_lights",
          title: "Opportunità da lavorare",
          url: "https://api.finanza.tech/wallboard/opportunita_urgenti",
          poll_rate: 300000,
        },

      ]
    }
  ],
};

app.start(config)

