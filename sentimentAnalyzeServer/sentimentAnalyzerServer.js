const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = new express();


function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}


app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let url = req.query.url;
    let nlu = getNLUInstance();
    const analyzeParams = {
        'url': url,
        'features': {
            'emotion': {
                'document': true
            }
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults);
        })
        .catch(err => {
            console.error('error:', err);
            return res.status(400).send(err.message);
        });
    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let url = req.query.url;
    let nlu = getNLUInstance();
    const analyzeParams = {
        'url': url,
        'features': {
            'sentiment': {
                'document': true
            }
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults);
        })
        .catch(err => {
            console.error('error:', err);
            return res.status(400).send(err.message);
        });
    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let text = req.query.text;
    let nlu = getNLUInstance();
    const analyzeParams = {
        'text': text,
        'features': {
            'emotion': {
                'document': true
            }
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults);
        })
        .catch(err => {
            console.error('error:', err);
            return res.status(400).send(err.message);
        });
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    let text = req.query.text;
    let nlu = getNLUInstance();
    const analyzeParams = {
        'text': text,
        'features': {
            'sentiment': {
                'document': true
            }
        }
    };
    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults);
        })
        .catch(err => {
            console.error('error:', err);
            return res.status(400).send(err.message);
        });
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

